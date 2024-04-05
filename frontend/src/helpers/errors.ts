import type { FirebaseError } from 'firebase/app';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFirebaseError(error: any): error is FirebaseError {
  return error.name === 'FirebaseError' && error.code !== undefined;
}
