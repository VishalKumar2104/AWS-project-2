import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";

export type { FirebaseUser };

/**
 * Register a new user with email + password.
 * The role and profile setup happens via /api/v1/users/me/setup after this.
 */
export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

/**
 * Sign in an existing user with email + password.
 */
export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

/**
 * Sign in with Google popup.
 */
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

/**
 * Sign out the current user.
 */
export const signOut = () => firebaseSignOut(auth);

/**
 * Get the current user's ID token (auto-refreshed by Firebase if expired).
 * Returns null if no user is signed in.
 */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
};

/**
 * Force refresh the ID token (useful after role change / custom claim update).
 */
export const refreshIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken(true); // force refresh
  } catch {
    return null;
  }
};

/**
 * Subscribe to auth state changes.
 */
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) =>
  onAuthStateChanged(auth, callback);
