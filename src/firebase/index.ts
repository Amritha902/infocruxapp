import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase(): FirebaseInstances {
  if (!getApps().length) {
    try {
      firebaseApp = initializeApp(firebaseConfig);
      auth = getAuth(firebaseApp);
      firestore = getFirestore(firebaseApp);
    } catch (e) {
      console.error('Failed to initialize Firebase', e);
      // Fallback to a dummy implementation if initialization fails
      // This allows the app to run without a valid Firebase config
      if (!firebaseApp) {
        // @ts-ignore
        firebaseApp = { name: '[empty]', options: {}, automaticDataCollectionEnabled: false };
      }
      // @ts-ignore
      auth = { app: firebaseApp };
      // @ts-ignore
      firestore = { app: firebaseApp };
    }
  } else {
    firebaseApp = getApp();
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }

  return { app: firebaseApp, auth, firestore };
}

// Export a function to get the instances
export const getFirebase = () => initializeFirebase();

// We will add and export hooks for auth and firestore later
