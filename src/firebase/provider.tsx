
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  firestore: null,
});

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};

export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;


type FirebaseProviderProps = {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children, app, auth, firestore }) => {
  const value = useMemo(() => ({
    app,
    auth,
    firestore,
  }), [app, auth, firestore]);

  return (
    <FirebaseContext.Provider value={value}>
        {children}
        <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
};

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

export function FirebaseClientProvider({
    children
}: {
    children: React.ReactNode
}) {
    const { app, auth, firestore } = initializeFirebase();

    return (
        <FirebaseProvider app={app} auth={auth} firestore={firestore}>
            {children}
        </FirebaseProvider>
    );
}
