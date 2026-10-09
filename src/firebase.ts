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
  writeBatch,
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
    // Any successful network response (even doc not found) confirms Firestore reachable
    return true;
  }
}

// Firestore Sync Services for Museum Data
export async function fetchArchiveFromFirestore(): Promise<{
  slides: Slide[] | null;
  categories: Category[] | null;
  artifacts: Artifact[] | null;
  questions: QuizQuestion[] | null;
  aboutContent: AboutContent | null;
}> {
  try {
    const slidesSnap = await getDocs(collection(db, 'slides'));
    const categoriesSnap = await getDocs(collection(db, 'categories'));
    const artifactsSnap = await getDocs(collection(db, 'artifacts'));
    const questionsSnap = await getDocs(collection(db, 'questions'));
    const aboutSnap = await getDocs(collection(db, 'config'));

    const slides: Slide[] = [];
    slidesSnap.forEach((d) => slides.push(d.data() as Slide));

    const categories: Category[] = [];
    categoriesSnap.forEach((d) => categories.push(d.data() as Category));

    const artifacts: Artifact[] = [];
    artifactsSnap.forEach((d) => artifacts.push(d.data() as Artifact));

    const questions: QuizQuestion[] = [];
    questionsSnap.forEach((d) => questions.push(d.data() as QuizQuestion));

    let aboutContent: AboutContent | null = null;
    aboutSnap.forEach((d) => {
      if (d.id === 'about') {
        aboutContent = d.data() as AboutContent;
      }
    });

    return {
      slides: slides.length > 0 ? slides : null,
      categories: categories.length > 0 ? categories : null,
      artifacts: artifacts.length > 0 ? artifacts : null,
      questions: questions.length > 0 ? questions : null,
      aboutContent,
    };
  } catch (err) {
    console.warn('Could not fetch from Firestore, falling back to local archive:', err);
    return {
      slides: null,
      categories: null,
      artifacts: null,
      questions: null,
      aboutContent: null,
    };
  }
}

// Batch Sync Local Archive to Cloud Firestore
export async function syncArchiveToFirestore(
  slides: Slide[],
  categories: Category[],
  artifacts: Artifact[],
  questions: QuizQuestion[],
  aboutContent: AboutContent
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    let count = 0;
    // Sync Slides
    for (const slide of slides) {
      await setDoc(doc(db, 'slides', slide.id), slide);
      count++;
    }
    // Sync Categories
    for (const cat of categories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
      count++;
    }
    // Sync Artifacts
    for (const art of artifacts) {
      await setDoc(doc(db, 'artifacts', art.id), art);
      count++;
    }
    // Sync Questions
    for (const q of questions) {
      await setDoc(doc(db, 'questions', q.id), q);
      count++;
    }
    // Sync About
    await setDoc(doc(db, 'config', 'about'), {
      ...aboutContent,
      id: 'about',
    });
    count++;

    return { success: true, count };
  } catch (err) {
    console.error('Failed to sync to Firestore:', err);
    return {
      success: false,
      count: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
