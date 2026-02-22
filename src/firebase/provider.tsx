
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
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

export function FirebaseClientProvider({
    children
}: {
    children: React.ReactNode
}) {
    const { initializeFirebase } = require('./index');
    const { app, auth, firestore } = initializeFirebase();

    return (
        <FirebaseProvider app={app} auth={auth} firestore={firestore}>
            {children}
        </FirebaseProvider>
    );
}

