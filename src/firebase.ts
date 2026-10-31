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

export type CollectionName =
  | 'slides'
  | 'categories'
  | 'artifacts'
  | 'questions'
  | 'config'
  | 'present_categories'
  | 'present_artifacts'
  | 'present_questions'
  | 'future_categories'
  | 'future_artifacts'
  | 'future_questions';

export interface PendingWrite {
  key: string; // e.g. "artifacts:nokia-3310" or "present_categories:economic"
  collectionName: CollectionName;
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
  collectionName: CollectionName,
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
  onPresentCategories?: (categories: Category[]) => void;
  onPresentArtifacts?: (artifacts: Artifact[]) => void;
  onPresentQuestions?: (questions: QuizQuestion[]) => void;
  onFutureCategories?: (categories: Category[]) => void;
  onFutureArtifacts?: (artifacts: Artifact[]) => void;
  onFutureQuestions?: (questions: QuizQuestion[]) => void;
  onAbout?: (about: AboutContent) => void;
  onError?: (error: unknown) => void;
}

/**
 * Sets up live real-time listeners across all devices.
 * Whenever an admin adds, edits, or deletes an item in the Cloud, all visitor devices update in real-time.
 */
export function subscribeToArchive(callbacks: ArchiveSubscribeCallbacks): () => void {
  const unsubs: Unsubscribe[] = [];

  // Helper to attach error handling listener
  const listenCollection = <T>(
    collName: CollectionName,
    onData: (list: T[]) => void
  ) => {
    const unsub = onSnapshot(
      collection(db, collName),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: T[] = [];
          snapshot.forEach((d) => list.push(d.data() as T));
          onData(list);
        }
      },
      (error) => {
        if (!isQuotaExceededError(error)) {
          callbacks.onError?.(error);
          try {
            handleFirestoreError(error, OperationType.GET, collName);
          } catch {}
        }
      }
    );
    unsubs.push(unsub);
  };

  // 1. Retro Era Collections
  if (callbacks.onSlides) listenCollection<Slide>('slides', callbacks.onSlides);
  if (callbacks.onCategories) listenCollection<Category>('categories', callbacks.onCategories);
  if (callbacks.onArtifacts) listenCollection<Artifact>('artifacts', callbacks.onArtifacts);
  if (callbacks.onQuestions) listenCollection<QuizQuestion>('questions', callbacks.onQuestions);

  // 2. Present Time (2026) Collections - Real-time sync across all devices!
  if (callbacks.onPresentCategories) {
    listenCollection<Category>('present_categories', callbacks.onPresentCategories);
  }
  if (callbacks.onPresentArtifacts) {
    listenCollection<Artifact>('present_artifacts', callbacks.onPresentArtifacts);
  }
  if (callbacks.onPresentQuestions) {
    listenCollection<QuizQuestion>('present_questions', callbacks.onPresentQuestions);
  }

  // 3. Future (2030-2040) Collections - Real-time sync across all devices!
  if (callbacks.onFutureCategories) {
    listenCollection<Category>('future_categories', callbacks.onFutureCategories);
  }
  if (callbacks.onFutureArtifacts) {
    listenCollection<Artifact>('future_artifacts', callbacks.onFutureArtifacts);
  }
  if (callbacks.onFutureQuestions) {
    listenCollection<QuizQuestion>('future_questions', callbacks.onFutureQuestions);
  }

  // 4. About Config real-time subscription
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
  aboutContent: AboutContent,
  presentCategories?: Category[],
  presentArtifacts?: Artifact[],
  presentQuestions?: QuizQuestion[],
  futureCategories?: Category[],
  futureArtifacts?: Artifact[],
  futureQuestions?: QuizQuestion[]
): Promise<boolean> {
  if (isFirestoreQuotaExhausted()) {
    return false;
  }

  try {
    // Check if retro artifacts exist
    const artSnap = await getDocs(collection(db, 'artifacts'));
    const presentCatSnap = await getDocs(collection(db, 'present_categories'));

    const needsRetroSeed = artSnap.empty;
    const needsPresentSeed = presentCatSnap.empty && presentCategories && presentCategories.length > 0;

    if (!needsRetroSeed && !needsPresentSeed) {
      return false;
    }

    console.log('Seeding initial/era archive data to Cloud Firestore for multi-device sync...');
    await syncAllToFirestore(
      slides,
      categories,
      artifacts,
      questions,
      aboutContent,
      presentCategories,
      presentArtifacts,
      presentQuestions,
      futureCategories,
      futureArtifacts,
      futureQuestions
    );
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
 * Auto-migrates any custom uploaded banner images or content saved in local storage on this machine
 * to Cloud Firestore so all other devices (smartphones, other laptops) immediately receive them live.
 */
export async function autoMigrateLocalDataToFirestore(
  localPresentCategories: Category[],
  localPresentArtifacts: Artifact[],
  localPresentQuestions: QuizQuestion[],
  localFutureCategories: Category[],
  localFutureArtifacts: Artifact[],
  localFutureQuestions: QuizQuestion[]
): Promise<void> {
  if (isFirestoreQuotaExhausted()) return;

  try {
    // Check present categories in cloud
    const presentSnap = await getDocs(collection(db, 'present_categories'));
    const cloudPresentMap = new Map<string, Category>();
    presentSnap.forEach((d) => cloudPresentMap.set(d.id, d.data() as Category));

    // If local present category has a custom bannerImageUrl that cloud does not have, sync it!
    for (const localCat of localPresentCategories) {
      const cloudCat = cloudPresentMap.get(localCat.id);
      if (
        localCat.bannerImageUrl &&
        (!cloudCat || cloudCat.bannerImageUrl !== localCat.bannerImageUrl)
      ) {
        console.log(`[AutoMigrate] Syncing local banner graphic for "${localCat.name}" to Cloud Firestore...`);
        enqueueWrite('present_categories', localCat.id, 'set', localCat);
      } else if (!cloudCat) {
        enqueueWrite('present_categories', localCat.id, 'set', localCat);
      }
    }

    // Also ensure present artifacts and questions exist in cloud
    const presentArtSnap = await getDocs(collection(db, 'present_artifacts'));
    if (presentArtSnap.empty && localPresentArtifacts.length > 0) {
      for (const a of localPresentArtifacts) {
        enqueueWrite('present_artifacts', a.id, 'set', a);
      }
    }

    const presentQSnap = await getDocs(collection(db, 'present_questions'));
    if (presentQSnap.empty && localPresentQuestions.length > 0) {
      for (const q of localPresentQuestions) {
        enqueueWrite('present_questions', q.id, 'set', q);
      }
    }

    // Future era check
    const futureCatSnap = await getDocs(collection(db, 'future_categories'));
    if (futureCatSnap.empty && localFutureCategories.length > 0) {
      for (const c of localFutureCategories) {
        enqueueWrite('future_categories', c.id, 'set', c);
      }
    }
    const futureArtSnap = await getDocs(collection(db, 'future_artifacts'));
    if (futureArtSnap.empty && localFutureArtifacts.length > 0) {
      for (const a of localFutureArtifacts) {
        enqueueWrite('future_artifacts', a.id, 'set', a);
      }
    }
    const futureQSnap = await getDocs(collection(db, 'future_questions'));
    if (futureQSnap.empty && localFutureQuestions.length > 0) {
      for (const q of localFutureQuestions) {
        enqueueWrite('future_questions', q.id, 'set', q);
      }
    }

    // Flush queued writes immediately
    flushPendingOutbox();
  } catch (err) {
    console.warn('[AutoMigrate] Could not auto-migrate local data to Firestore:', err);
  }
}

/**
 * Batch Sync Full Archive (All Eras) to Cloud Firestore
 */
export async function syncAllToFirestore(
  slides: Slide[],
  categories: Category[],
  artifacts: Artifact[],
  questions: QuizQuestion[],
  aboutContent: AboutContent,
  presentCategories?: Category[],
  presentArtifacts?: Artifact[],
  presentQuestions?: QuizQuestion[],
  futureCategories?: Category[],
  futureArtifacts?: Artifact[],
  futureQuestions?: QuizQuestion[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (isFirestoreQuotaExhausted()) {
    // Enqueue all items into compact outbox so none are lost
    for (const slide of slides) enqueueWrite('slides', slide.id, 'set', slide);
    for (const cat of categories) enqueueWrite('categories', cat.id, 'set', cat);
    for (const art of artifacts) enqueueWrite('artifacts', art.id, 'set', art);
    for (const q of questions) enqueueWrite('questions', q.id, 'set', q);
    enqueueWrite('config', 'about', 'set', { ...aboutContent, id: 'about' });

    if (presentCategories) {
      for (const cat of presentCategories) enqueueWrite('present_categories', cat.id, 'set', cat);
    }
    if (presentArtifacts) {
      for (const art of presentArtifacts) enqueueWrite('present_artifacts', art.id, 'set', art);
    }
    if (presentQuestions) {
      for (const q of presentQuestions) enqueueWrite('present_questions', q.id, 'set', q);
    }
    if (futureCategories) {
      for (const cat of futureCategories) enqueueWrite('future_categories', cat.id, 'set', cat);
    }
    if (futureArtifacts) {
      for (const art of futureArtifacts) enqueueWrite('future_artifacts', art.id, 'set', art);
    }
    if (futureQuestions) {
      for (const q of futureQuestions) enqueueWrite('future_questions', q.id, 'set', q);
    }

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
    // Retro Categories, Artifacts, Questions
    for (const cat of categories) {
      await setDoc(doc(db, 'categories', cat.id), cleanFirestoreData(cat));
      count++;
    }
    for (const art of artifacts) {
      await setDoc(doc(db, 'artifacts', art.id), cleanFirestoreData(art));
      count++;
    }
    for (const q of questions) {
      await setDoc(doc(db, 'questions', q.id), cleanFirestoreData(q));
      count++;
    }
    // About
    await setDoc(doc(db, 'config', 'about'), cleanFirestoreData({ ...aboutContent, id: 'about' }));
    count++;

    // Present Time (2026)
    if (presentCategories) {
      for (const cat of presentCategories) {
        await setDoc(doc(db, 'present_categories', cat.id), cleanFirestoreData(cat));
        count++;
      }
    }
    if (presentArtifacts) {
      for (const art of presentArtifacts) {
        await setDoc(doc(db, 'present_artifacts', art.id), cleanFirestoreData(art));
        count++;
      }
    }
    if (presentQuestions) {
      for (const q of presentQuestions) {
        await setDoc(doc(db, 'present_questions', q.id), cleanFirestoreData(q));
        count++;
      }
    }

    // Future (2030-2040)
    if (futureCategories) {
      for (const cat of futureCategories) {
        await setDoc(doc(db, 'future_categories', cat.id), cleanFirestoreData(cat));
        count++;
      }
    }
    if (futureArtifacts) {
      for (const art of futureArtifacts) {
        await setDoc(doc(db, 'future_artifacts', art.id), cleanFirestoreData(art));
        count++;
      }
    }
    if (futureQuestions) {
      for (const q of futureQuestions) {
        await setDoc(doc(db, 'future_questions', q.id), cleanFirestoreData(q));
        count++;
      }
    }

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
 * Generic helper for granular diff syncing
 */
function syncCollectionDiff<T extends { id: string }>(
  collName: CollectionName,
  oldList: T[],
  newList: T[]
): void {
  const oldMap = new Map(oldList.map((item) => [item.id, item]));
  const newIds = new Set(newList.map((item) => item.id));

  // Find deleted
  for (const old of oldList) {
    if (!newIds.has(old.id)) {
      enqueueWrite(collName, old.id, 'delete');
    }
  }
  // Find added or modified ONLY
  for (const next of newList) {
    const prev = oldMap.get(next.id);
    if (!prev || JSON.stringify(cleanFirestoreData(prev)) !== JSON.stringify(cleanFirestoreData(next))) {
      enqueueWrite(collName, next.id, 'set', next);
    }
  }
}

export async function syncSlidesDiff(oldList: Slide[], newList: Slide[]): Promise<void> {
  syncCollectionDiff('slides', oldList, newList);
}

export async function syncCategoriesDiff(oldList: Category[], newList: Category[]): Promise<void> {
  syncCollectionDiff('categories', oldList, newList);
}

export async function syncArtifactsDiff(oldList: Artifact[], newList: Artifact[]): Promise<void> {
  syncCollectionDiff('artifacts', oldList, newList);
}

export async function syncQuestionsDiff(oldList: QuizQuestion[], newList: QuizQuestion[]): Promise<void> {
  syncCollectionDiff('questions', oldList, newList);
}

export async function syncPresentCategoriesDiff(oldList: Category[], newList: Category[]): Promise<void> {
  syncCollectionDiff('present_categories', oldList, newList);
}

export async function syncPresentArtifactsDiff(oldList: Artifact[], newList: Artifact[]): Promise<void> {
  syncCollectionDiff('present_artifacts', oldList, newList);
}

export async function syncPresentQuestionsDiff(oldList: QuizQuestion[], newList: QuizQuestion[]): Promise<void> {
  syncCollectionDiff('present_questions', oldList, newList);
}

export async function syncFutureCategoriesDiff(oldList: Category[], newList: Category[]): Promise<void> {
  syncCollectionDiff('future_categories', oldList, newList);
}

export async function syncFutureArtifactsDiff(oldList: Artifact[], newList: Artifact[]): Promise<void> {
  syncCollectionDiff('future_artifacts', oldList, newList);
}

export async function syncFutureQuestionsDiff(oldList: QuizQuestion[], newList: QuizQuestion[]): Promise<void> {
  syncCollectionDiff('future_questions', oldList, newList);
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
  defaultAbout: AboutContent,
  defaultPresentCategories?: Category[],
  defaultPresentArtifacts?: Artifact[],
  defaultPresentQuestions?: QuizQuestion[],
  defaultFutureCategories?: Category[],
  defaultFutureArtifacts?: Artifact[],
  defaultFutureQuestions?: QuizQuestion[]
): Promise<void> {
  if (isFirestoreQuotaExhausted()) {
    console.warn('[Firestore] Reset cloud skipped: daily write quota reached.');
    return;
  }

  try {
    const collectionsToClear: CollectionName[] = [
      'slides',
      'categories',
      'artifacts',
      'questions',
      'present_categories',
      'present_artifacts',
      'present_questions',
      'future_categories',
      'future_artifacts',
      'future_questions',
    ];

    for (const colName of collectionsToClear) {
      const snap = await getDocs(collection(db, colName));
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    }

    await syncAllToFirestore(
      defaultSlides,
      defaultCategories,
      defaultArtifacts,
      defaultQuestions,
      defaultAbout,
      defaultPresentCategories,
      defaultPresentArtifacts,
      defaultPresentQuestions,
      defaultFutureCategories,
      defaultFutureArtifacts,
      defaultFutureQuestions
    );
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
