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
  writeBatch,
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
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
 */
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
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
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or connecting...');
      return false;
    }
    return true;
  }
}

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
        callbacks.onError?.(error);
        try {
          handleFirestoreError(error, OperationType.GET, 'slides');
        } catch {}
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
        callbacks.onError?.(error);
        try {
          handleFirestoreError(error, OperationType.GET, 'categories');
        } catch {}
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
        callbacks.onError?.(error);
        try {
          handleFirestoreError(error, OperationType.GET, 'artifacts');
        } catch {}
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
        callbacks.onError?.(error);
        try {
          handleFirestoreError(error, OperationType.GET, 'questions');
        } catch {}
      }
    );
    unsubs.push(unsubQuestions);
  }

  // 5. About content real-time subscription
  if (callbacks.onAbout) {
    const unsubAbout = onSnapshot(
      doc(db, 'config', 'about'),
      (snapshot) => {
        if (snapshot.exists()) {
          callbacks.onAbout?.(snapshot.data() as AboutContent);
        }
      },
      (error) => {
        callbacks.onError?.(error);
        try {
          handleFirestoreError(error, OperationType.GET, 'config/about');
        } catch {}
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
  try {
    const artSnap = await getDocs(collection(db, 'artifacts'));
    if (!artSnap.empty) {
      // Cloud database already has items!
      return false;
    }

    console.log('Seeding initial archive data to Cloud Firestore for multi-device sync...');
    await syncAllToFirestore(slides, categories, artifacts, questions, aboutContent);
    return true;
  } catch (err) {
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
 */
export async function syncSlidesDiff(oldList: Slide[], newList: Slide[]): Promise<void> {
  try {
    const newIds = new Set(newList.map((s) => s.id));
    // Find deleted
    for (const old of oldList) {
      if (!newIds.has(old.id)) {
        await deleteDoc(doc(db, 'slides', old.id));
      }
    }
    // Find added or modified
    for (const next of newList) {
      await setDoc(doc(db, 'slides', next.id), cleanFirestoreData(next));
    }
  } catch (err) {
    console.error('Error syncing slides diff to Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.WRITE, 'slides');
    } catch {}
  }
}

/**
 * Granular sync helpers: when an admin creates, updates, or deletes categories
 */
export async function syncCategoriesDiff(oldList: Category[], newList: Category[]): Promise<void> {
  try {
    const newIds = new Set(newList.map((c) => c.id));
    // Find deleted
    for (const old of oldList) {
      if (!newIds.has(old.id)) {
        await deleteDoc(doc(db, 'categories', old.id));
      }
    }
    // Find added or modified
    for (const next of newList) {
      await setDoc(doc(db, 'categories', next.id), cleanFirestoreData(next));
    }
  } catch (err) {
    console.error('Error syncing categories diff to Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.WRITE, 'categories');
    } catch {}
  }
}

/**
 * Granular sync helpers: when an admin creates, updates, or deletes artifacts
 */
export async function syncArtifactsDiff(oldList: Artifact[], newList: Artifact[]): Promise<void> {
  try {
    const newIds = new Set(newList.map((a) => a.id));
    // Find deleted
    for (const old of oldList) {
      if (!newIds.has(old.id)) {
        await deleteDoc(doc(db, 'artifacts', old.id));
      }
    }
    // Find added or modified
    for (const next of newList) {
      await setDoc(doc(db, 'artifacts', next.id), cleanFirestoreData(next));
    }
  } catch (err) {
    console.error('Error syncing artifacts diff to Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.WRITE, 'artifacts');
    } catch {}
  }
}

/**
 * Granular sync helpers: when an admin creates, updates, or deletes questions
 */
export async function syncQuestionsDiff(oldList: QuizQuestion[], newList: QuizQuestion[]): Promise<void> {
  try {
    const newIds = new Set(newList.map((q) => q.id));
    // Find deleted
    for (const old of oldList) {
      if (!newIds.has(old.id)) {
        await deleteDoc(doc(db, 'questions', old.id));
      }
    }
    // Find added or modified
    for (const next of newList) {
      await setDoc(doc(db, 'questions', next.id), cleanFirestoreData(next));
    }
  } catch (err) {
    console.error('Error syncing questions diff to Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.WRITE, 'questions');
    } catch {}
  }
}

/**
 * Granular sync helpers: when an admin updates About Content
 */
export async function syncAboutContentToFirestore(about: AboutContent): Promise<void> {
  try {
    await setDoc(doc(db, 'config', 'about'), cleanFirestoreData({ ...about, id: 'about' }));
  } catch (err) {
    console.error('Error syncing about to Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.WRITE, 'config/about');
    } catch {}
  }
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
  try {
    // Delete existing documents
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

    // Re-seed defaults
    await syncAllToFirestore(defaultSlides, defaultCategories, defaultArtifacts, defaultQuestions, defaultAbout);
  } catch (err) {
    console.error('Error resetting Firestore to defaults:', err);
    try {
      handleFirestoreError(err, OperationType.WRITE, 'reset');
    } catch {}
  }
}
