
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // In a real app, you might log this to an error reporting service
      // For this dev environment, we throw it to make it visible in the Next.js overlay
      if (process.env.NODE_ENV === 'development') {
        console.error("A Firestore permission error was caught. This will be thrown to show the Next.js error overlay. This is expected development behavior.");
        // We need to throw this in a timeout to break out of the React render cycle
        setTimeout(() => {
            throw error;
        }, 0)
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.removeListener('permission-error', handleError);
    };
  }, []);

  return null; // This component doesn't render anything
}
