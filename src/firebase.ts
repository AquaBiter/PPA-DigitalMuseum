import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Slide, Category, Artifact, QuizQuestion, AboutContent } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;
export const FIRESTORE_DATABASE_ID = firebaseConfig.firestoreDatabaseId;

// Console and Hosting URLs
export const FIREBASE_CONSOLE_URL = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/overview`;
export const FIREBASE_FIRESTORE_URL = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data`;
export const FIREBASE_HOSTING_URL = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/hosting`;
export const FIREBASE_AUTH_URL = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication`;
export const FIREBASE_RULES_URL = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/rules`;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Key used to store daily write quota exhausted timestamp in browser storage
const QUOTA_EXHAUSTED_KEY = 'ppa_firestore_quota_exhausted';
// 1 hour cooldown before attempting cloud writes again after a quota limit
const QUOTA_COOLDOWN_MS = 60 * 60 * 1000;

const OUTBOX_STORAGE_KEY = 'ppa_pending_outbox';
const FLUSH_DEBOUNCE_MS = 1200;

export interface PendingWrite {
  key: string; // e.g. "artifacts:nokia-3310"
  collectionName: 'slides' | 'categories' | 'artifacts' | 'questions' | 'config';
  docId: string;
  action: 'set' | 'delete';
  data?: any;
  timestamp: number;
}

/**
 * Checks whether the free tier daily write quota is currently marked as exhausted.
 */
export function isFirestoreQuotaExhausted(): boolean {
  try {
    const raw = localStorage.getItem(QUOTA_EXHAUSTED_KEY);
    if (!raw) return false;
    const timestamp = parseInt(raw, 10);
    if (isNaN(timestamp)) return false;
    if (Date.now() - timestamp > QUOTA_COOLDOWN_MS) {
      localStorage.removeItem(QUOTA_EXHAUSTED_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Marks the daily write quota as exhausted to prevent infinite backoff retry loops.
 */
export function markFirestoreQuotaExhausted(): void {
  try {
    localStorage.setItem(QUOTA_EXHAUSTED_KEY, Date.now().toString());
    window.dispatchEvent(new Event('firestore-quota-changed'));
  } catch {}
}

/**
 * Clears the quota exhausted flag manually.
 */
export function clearFirestoreQuotaExhausted(): void {
  try {
    localStorage.removeItem(QUOTA_EXHAUSTED_KEY);
    window.dispatchEvent(new Event('firestore-quota-changed'));
  } catch {}
}

/**
 * Helper to test if an error represents a resource exhaustion or quota limit.
 */
export function isQuotaExceededError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  const code = (error as any)?.code;
  return (
    code === 'resource-exhausted' ||
    msg.includes('resource-exhausted') ||
    msg.includes('Quota limit exceeded') ||
    msg.includes('Free daily write units')
  );
}

/**
 * Checks error and marks quota exhausted if applicable. Returns true if quota error was handled.
 */
export function checkAndMarkQuotaExhausted(error: unknown): boolean {
  if (isQuotaExceededError(error)) {
    markFirestoreQuotaExhausted();
    return true;
  }
  return false;
}

/**
 * Subscribes to quota status changes.
 */
export function onQuotaExhaustedChanged(listener: (isExhausted: boolean) => void): () => void {
  const handler = () => {
    listener(isFirestoreQuotaExhausted());
  };
  window.addEventListener('storage', handler);
  window.addEventListener('firestore-quota-changed', handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('firestore-quota-changed', handler);
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  // Gracefully handle daily write quota limits to prevent unhandled promise rejections
  if (checkAndMarkQuotaExhausted(error)) {
    console.warn(
      `[Firestore Quota Guard] Free daily write quota reached for project. Operation ${operationType} on ${path} paused. Falling back to offline local storage.`
    );
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Strips undefined properties recursively so Firestore does not reject writes.
 * Also safeguards against oversized data URLs exceeding Firestore's 1MB document limit.
 */
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (typeof value === 'string' && value.startsWith('data:image') && value.length > 780000) {
        console.warn(
          `[Firestore Data Protection] Dropping field "${key}" because size (${value.length} chars) exceeds the safe Firestore document limit.`
        );
        continue;
      }
      if (Array.isArray(value)) {
        clean[key] = value.map((item) =>
          typeof item === 'object' && item !== null ? cleanFirestoreData(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        clean[key] = cleanFirestoreData(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

// Validate connection to Firestore as required by skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (isQuotaExceededError(error)) {
      markFirestoreQuotaExhausted();
      return true; // Still connected for reading, write quota is marked
    }
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or connecting...');
      return false;
    }
    return true;
  }
}

// -------------------------------------------------------------
// PENDING WRITE OUTBOX, WRITE COALESCING & HISTORY PRUNING
// -------------------------------------------------------------

export function getPendingOutbox(): PendingWrite[] {
  try {
    const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePendingOutbox(queue: PendingWrite[]): void {
  try {
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent('ppa_outbox_updated', { detail: { count: queue.length } }));
  } catch (err) {
    console.warn('[SyncQueue] Storage full while saving outbox, pruning older entries:', err);
    pruneStorageHistory();
    try {
      const trimmed = queue.slice(-30);
      localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(trimmed));
    } catch {}
  }
}

let flushTimeout: any = null;
let isFlushing = false;

/**
 * Enqueue a write operation.
 * Previous intermediate writes for the same document are deleted from history
 * to recover write tokens and keep the payload compact.
 */
export function enqueueWrite(
  collectionName: 'slides' | 'categories' | 'artifacts' | 'questions' | 'config',
  docId: string,
  action: 'set' | 'delete',
  data?: any
): void {
  const key = `${collectionName}:${docId}`;
  let outbox = getPendingOutbox();

  // Write Coalescing: delete previous version of this document from history
  const previousIdx = outbox.findIndex((item) => item.key === key);
  if (previousIdx >= 0) {
    const previous = outbox[previousIdx];
    // If it was just added in queue and now deleted, cancel both out to save 2 writes!
    if (previous.action === 'set' && action === 'delete') {
      outbox.splice(previousIdx, 1);
      savePendingOutbox(outbox);
      return;
    }
    // Delete older revision from queue history
    outbox.splice(previousIdx, 1);
  }

  outbox.push({
    key,
    collectionName,
    docId,
    action,
    data: data ? cleanFirestoreData(data) : undefined,
    timestamp: Date.now(),
  });

  savePendingOutbox(outbox);

  // Debounced flush
  if (flushTimeout) clearTimeout(flushTimeout);
  flushTimeout = setTimeout(() => {
    flushPendingOutbox();
  }, FLUSH_DEBOUNCE_MS);
}

/**
 * Flushes all pending writes to Firestore.
 * If quota is exceeded, gracefully keeps writes queued in localStorage until quota resets.
 */
export async function flushPendingOutbox(): Promise<{ processed: number; remaining: number; error?: string }> {
  if (isFlushing) return { processed: 0, remaining: getPendingOutbox().length };
  if (isFirestoreQuotaExhausted()) {
    return {
      processed: 0,
      remaining: getPendingOutbox().length,
      error: 'Daily write quota is currently exhausted. Writes are preserved in local outbox.',
    };
  }

  let outbox = getPendingOutbox();
  if (outbox.length === 0) return { processed: 0, remaining: 0 };

  isFlushing = true;
  let processedCount = 0;
  const remainingQueue: PendingWrite[] = [];

  for (let i = 0; i < outbox.length; i++) {
    const item = outbox[i];

    if (isFirestoreQuotaExhausted()) {
      remainingQueue.push(...outbox.slice(i));
      break;
    }

    try {
      const docRef = doc(db, item.collectionName, item.docId);
      if (item.action === 'delete') {
        await deleteDoc(docRef);
      } else if (item.data) {
        await setDoc(docRef, item.data);
      }
      processedCount++;
    } catch (err: any) {
      if (checkAndMarkQuotaExhausted(err)) {
        console.warn('[SyncQueue] Daily write quota reached during flush. Remaining items will sync on reset.');
        remainingQueue.push(...outbox.slice(i));
        break;
      } else {
        console.error(`[SyncQueue] Failed to write ${item.key}:`, err);
        remainingQueue.push(item);
      }
    }
  }

  isFlushing = false;
  savePendingOutbox(remainingQueue);
  return { processed: processedCount, remaining: remainingQueue.length };
}

/**
 * Prunes obsolete localStorage history, temporary caches, and redundant data
 * to recover local storage space and prevent QuotaExceededError.
 */
export function pruneStorageHistory(): { recoveredKeys: number } {
  let count = 0;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      if (
        key.startsWith('temp_') ||
        key.startsWith('draft_') ||
        key.includes('_backup_') ||
        key.startsWith('cache_')
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((k) => {
      localStorage.removeItem(k);
      count++;
    });

    console.log(`[Storage Pruner] Cleaned up ${count} stale history/cache keys to recover storage tokens.`);
  } catch (err) {
    console.warn('[Storage Pruner] Error during history pruning:', err);
  }
  return { recoveredKeys: count };
}

/**
 * Manually force a retry: clears quota cooldown flag and immediately flushes the compact outbox.
 */
export async function forceRetrySync(): Promise<{ processed: number; remaining: number; error?: string }> {
  clearFirestoreQuotaExhausted();
  return await flushPendingOutbox();
}

// -------------------------------------------------------------
// REAL-TIME SUBSCRIBER
// -------------------------------------------------------------

export interface ArchiveSubscribeCallbacks {
  onSlides?: (slides: Slide[]) => void;
  onCategories?: (categories: Category[]) => void;
  onArtifacts?: (artifacts: Artifact[]) => void;
  onQuestions?: (questions: QuizQuestion[]) => void;
  onAbout?: (about: AboutContent) => void;
  onError?: (error: unknown) => void;
}

/**
 * Sets up live real-time listeners across all devices.
 * Whenever an admin adds, edits, or deletes an item in the Cloud, all visitor devices update in real-time.
 */
export function subscribeToArchive(callbacks: ArchiveSubscribeCallbacks): () => void {
  const unsubs: Unsubscribe[] = [];

  // 1. Slides real-time subscription
  if (callbacks.onSlides) {
    const unsubSlides = onSnapshot(
      collection(db, 'slides'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Slide[] = [];
          snapshot.forEach((d) => list.push(d.data() as Slide));
          callbacks.onSlides?.(list);
        }
      },
      (error) => {
        if (!isQuotaExceededError(error)) {
          callbacks.onError?.(error);
          try {
            handleFirestoreError(error, OperationType.GET, 'slides');
          } catch {}
        }
      }
    );
    unsubs.push(unsubSlides);
  }

  // 2. Categories real-time subscription
  if (callbacks.onCategories) {
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Category[] = [];
          snapshot.forEach((d) => list.push(d.data() as Category));
          callbacks.onCategories?.(list);
        }
      },
      (error) => {
        if (!isQuotaExceededError(error)) {
          callbacks.onError?.(error);
          try {
            handleFirestoreError(error, OperationType.GET, 'categories');
          } catch {}
        }
      }
    );
    unsubs.push(unsubCategories);
  }

  // 3. Artifacts real-time subscription
  if (callbacks.onArtifacts) {
    const unsubArtifacts = onSnapshot(
      collection(db, 'artifacts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Artifact[] = [];
          snapshot.forEach((d) => list.push(d.data() as Artifact));
          callbacks.onArtifacts?.(list);
        }
      },
      (error) => {
        if (!isQuotaExceededError(error)) {
          callbacks.onError?.(error);
          try {
            handleFirestoreError(error, OperationType.GET, 'artifacts');
          } catch {}
        }
      }
    );
    unsubs.push(unsubArtifacts);
  }

  // 4. Questions real-time subscription
  if (callbacks.onQuestions) {
    const unsubQuestions = onSnapshot(
      collection(db, 'questions'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: QuizQuestion[] = [];
          snapshot.forEach((d) => list.push(d.data() as QuizQuestion));
          callbacks.onQuestions?.(list);
        }
      },
      (error) => {
        if (!isQuotaExceededError(error)) {
          callbacks.onError?.(error);
          try {
            handleFirestoreError(error, OperationType.GET, 'questions');
          } catch {}
        }
      }
    );
    unsubs.push(unsubQuestions);
  }

  // 5. About Config real-time subscription
  if (callbacks.onAbout) {
    const unsubAbout = onSnapshot(
      doc(db, 'config', 'about'),
      (snapshot) => {
        if (snapshot.exists()) {
          callbacks.onAbout?.(snapshot.data() as AboutContent);
        }
      },
      (error) => {
        if (!isQuotaExceededError(error)) {
          callbacks.onError?.(error);
          try {
            handleFirestoreError(error, OperationType.GET, 'config/about');
          } catch {}
        }
      }
    );
    unsubs.push(unsubAbout);
  }

  return () => {
    unsubs.forEach((unsub) => {
      try {
        unsub();
      } catch {}
    });
  };
}

/**
 * Check if Cloud Firestore is empty, and if so, populate it with the initial archive
 * so all connected devices immediately have the shared cloud archive data.
 */
export async function seedArchiveIfEmpty(
  slides: Slide[],
  categories: Category[],
  artifacts: Artifact[],
  questions: QuizQuestion[],
  aboutContent: AboutContent
): Promise<boolean> {
  if (isFirestoreQuotaExhausted()) {
    return false;
  }

  try {
    if (localStorage.getItem('ppa_cloud_seeded') === 'true') {
      return false;
    }

    const artSnap = await getDocs(collection(db, 'artifacts'));
    if (!artSnap.empty) {
      try {
        localStorage.setItem('ppa_cloud_seeded', 'true');
      } catch {}
      return false;
    }

    console.log('Seeding initial archive data to Cloud Firestore for multi-device sync...');
    await syncAllToFirestore(slides, categories, artifacts, questions, aboutContent);
    try {
      localStorage.setItem('ppa_cloud_seeded', 'true');
    } catch {}
    return true;
  } catch (err) {
    if (checkAndMarkQuotaExhausted(err)) {
      console.warn('[Firestore] Seed skipped: daily quota limit reached.');
      return false;
    }
    console.warn('Could not seed archive:', err);
    return false;
  }
}

/**
 * Batch Sync Full Archive to Cloud Firestore
 */
export async function syncAllToFirestore(
  slides: Slide[],
  categories: Category[],
  artifacts: Artifact[],
  questions: QuizQuestion[],
  aboutContent: AboutContent
): Promise<{ success: boolean; count: number; error?: string }> {
  if (isFirestoreQuotaExhausted()) {
    // Enqueue all items into compact outbox so none are lost
    for (const slide of slides) enqueueWrite('slides', slide.id, 'set', slide);
    for (const cat of categories) enqueueWrite('categories', cat.id, 'set', cat);
    for (const art of artifacts) enqueueWrite('artifacts', art.id, 'set', art);
    for (const q of questions) enqueueWrite('questions', q.id, 'set', q);
    enqueueWrite('config', 'about', 'set', { ...aboutContent, id: 'about' });

    return {
      success: false,
      count: 0,
      error: 'Daily Cloud write quota reached. Changes are saved locally and queued in Outbox for syncing when quota resets.',
    };
  }

  try {
    let count = 0;
    // Slides
    for (const slide of slides) {
      await setDoc(doc(db, 'slides', slide.id), cleanFirestoreData(slide));
      count++;
    }
    // Categories
    for (const cat of categories) {
      await setDoc(doc(db, 'categories', cat.id), cleanFirestoreData(cat));
      count++;
    }
    // Artifacts
    for (const art of artifacts) {
      await setDoc(doc(db, 'artifacts', art.id), cleanFirestoreData(art));
      count++;
    }
    // Questions
    for (const q of questions) {
      await setDoc(doc(db, 'questions', q.id), cleanFirestoreData(q));
      count++;
    }
    // About
    await setDoc(doc(db, 'config', 'about'), cleanFirestoreData({ ...aboutContent, id: 'about' }));
    count++;

    return { success: true, count };
  } catch (err) {
    if (checkAndMarkQuotaExhausted(err)) {
      console.warn('[Firestore] Push to cloud paused: daily write quota reached.');
      return {
        success: false,
        count: 0,
        error: 'Daily Cloud write quota reached for today. Changes are active and stored in your browser.',
      };
    }
    console.error('Failed to sync to Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.WRITE, 'archive');
    } catch {}
    return {
      success: false,
      count: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Granular sync helpers: when an admin creates, updates, or deletes slides
 * Uses write coalescing: deletes superseded updates from history.
 */
export async function syncSlidesDiff(oldList: Slide[], newList: Slide[]): Promise<void> {
  const oldMap = new Map(oldList.map((s) => [s.id, s]));
  const newIds = new Set(newList.map((s) => s.id));

  // Find deleted
  for (const old of oldList) {
    if (!newIds.has(old.id)) {
      enqueueWrite('slides', old.id, 'delete');
    }
  }
  // Find added or modified ONLY
  for (const next of newList) {
    const prev = oldMap.get(next.id);
    if (!prev || JSON.stringify(cleanFirestoreData(prev)) !== JSON.stringify(cleanFirestoreData(next))) {
      enqueueWrite('slides', next.id, 'set', next);
    }
  }
}

/**
 * Granular sync helpers: when an admin creates, updates, or deletes categories
 * Uses write coalescing: deletes superseded updates from history.
 */
export async function syncCategoriesDiff(oldList: Category[], newList: Category[]): Promise<void> {
  const oldMap = new Map(oldList.map((c) => [c.id, c]));
  const newIds = new Set(newList.map((c) => c.id));

  // Find deleted
  for (const old of oldList) {
    if (!newIds.has(old.id)) {
      enqueueWrite('categories', old.id, 'delete');
    }
  }
  // Find added or modified ONLY
  for (const next of newList) {
    const prev = oldMap.get(next.id);
    if (!prev || JSON.stringify(cleanFirestoreData(prev)) !== JSON.stringify(cleanFirestoreData(next))) {
      enqueueWrite('categories', next.id, 'set', next);
    }
  }
}

/**
 * Granular sync helpers: when an admin creates, updates, or deletes artifacts
 * Uses write coalescing: deletes superseded updates from history.
 */
export async function syncArtifactsDiff(oldList: Artifact[], newList: Artifact[]): Promise<void> {
  const oldMap = new Map(oldList.map((a) => [a.id, a]));
  const newIds = new Set(newList.map((a) => a.id));

  // Find deleted
  for (const old of oldList) {
    if (!newIds.has(old.id)) {
      enqueueWrite('artifacts', old.id, 'delete');
    }
  }
  // Find added or modified ONLY
  for (const next of newList) {
    const prev = oldMap.get(next.id);
    if (!prev || JSON.stringify(cleanFirestoreData(prev)) !== JSON.stringify(cleanFirestoreData(next))) {
      enqueueWrite('artifacts', next.id, 'set', next);
    }
  }
}

/**
 * Granular sync helpers: when an admin creates, updates, or deletes questions
 * Uses write coalescing: deletes superseded updates from history.
 */
export async function syncQuestionsDiff(oldList: QuizQuestion[], newList: QuizQuestion[]): Promise<void> {
  const oldMap = new Map(oldList.map((q) => [q.id, q]));
  const newIds = new Set(newList.map((q) => q.id));

  // Find deleted
  for (const old of oldList) {
    if (!newIds.has(old.id)) {
      enqueueWrite('questions', old.id, 'delete');
    }
  }
  // Find added or modified ONLY
  for (const next of newList) {
    const prev = oldMap.get(next.id);
    if (!prev || JSON.stringify(cleanFirestoreData(prev)) !== JSON.stringify(cleanFirestoreData(next))) {
      enqueueWrite('questions', next.id, 'set', next);
    }
  }
}

/**
 * Granular sync helpers: when an admin updates About Content
 */
export async function syncAboutContentToFirestore(about: AboutContent): Promise<void> {
  enqueueWrite('config', 'about', 'set', { ...about, id: 'about' });
}

/**
 * Reset all Firestore collections to default archive data
 */
export async function resetFirestoreToDefaults(
  defaultSlides: Slide[],
  defaultCategories: Category[],
  defaultArtifacts: Artifact[],
  defaultQuestions: QuizQuestion[],
  defaultAbout: AboutContent
): Promise<void> {
  if (isFirestoreQuotaExhausted()) {
    console.warn('[Firestore] Reset cloud skipped: daily write quota reached.');
    return;
  }

  try {
    const [slidesSnap, catSnap, artSnap, qSnap] = await Promise.all([
      getDocs(collection(db, 'slides')),
      getDocs(collection(db, 'categories')),
      getDocs(collection(db, 'artifacts')),
      getDocs(collection(db, 'questions')),
    ]);

    for (const d of slidesSnap.docs) await deleteDoc(d.ref);
    for (const d of catSnap.docs) await deleteDoc(d.ref);
    for (const d of artSnap.docs) await deleteDoc(d.ref);
    for (const d of qSnap.docs) await deleteDoc(d.ref);

    await syncAllToFirestore(defaultSlides, defaultCategories, defaultArtifacts, defaultQuestions, defaultAbout);
  } catch (err) {
    if (checkAndMarkQuotaExhausted(err)) {
      console.warn('[Firestore] Reset cloud paused: daily write quota reached.');
      return;
    }
    console.error('Error resetting Firestore to defaults:', err);
    try {
      handleFirestoreError(err, OperationType.WRITE, 'reset');
    } catch {}
  }
}
