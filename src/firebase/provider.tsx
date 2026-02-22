
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
    // A quick check to see if the config is populated with actual values.
    // This prevents the app from crashing if the config contains placeholder values.
    const isConfigured = firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_");
  
    if (isConfigured) {
      if (!getApps().length) {
        try {
          firebaseApp = initializeApp(firebaseConfig);
          auth = getAuth(firebaseApp);
          firestore = getFirestore(firebaseApp);
        } catch (e) {
          console.error('Failed to initialize Firebase', e);
        }
      } else {
        firebaseApp = getApp();
        auth = getAuth(firebaseApp);
        firestore = getFirestore(firebaseApp);
      }
    }
    
    // Fallback to a dummy implementation if initialization fails or config is missing/invalid
    if (!firebaseApp) {
      if (!isConfigured) {
          console.warn("Firebase config is using placeholder values. Firebase features will be disabled. Please update src/firebase/config.ts with your project's actual configuration.");
      }
      // @ts-ignore
      firebaseApp = { name: '[dummy]', options: {}, automaticDataCollectionEnabled: false };
      // @ts-ignore
      auth = { app: firebaseApp };
      // @ts-ignore
      firestore = { app: firebaseApp };
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
