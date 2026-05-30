import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User,
  Auth
} from "firebase/auth";

let isInitialized = false;

/**
 * Lazy initializes and returns the Firebase Auth instance.
 */
export async function getFirebaseAuth(): Promise<Auth | null> {
  if (isInitialized) {
    return getAuth();
  }

  try {
    const response = await fetch("/firebase-applet-config.json");
    if (!response.ok) {
      console.warn("firebase-applet-config.json not found. Offline or key setup pending.");
      return null;
    }
    
    const config = await response.json();
    if (!config.apiKey || !config.authDomain) {
      console.warn("Missing critical parameters in firebase-applet-config.json");
      return null;
    }

    if (getApps().length === 0) {
      initializeApp(config);
    }
    isInitialized = true;
    return getAuth();
  } catch (err) {
    console.error("Failed to lazy initialize Firebase auth", err);
    return null;
  }
}

/**
 * Standard Firebase email & password sign up
 */
export async function signUpWithEmail(email: string, pass: string): Promise<User> {
  const authInstance = await getFirebaseAuth();
  if (!authInstance) {
    throw new Error("Firebase Auth is not initialized or configured.");
  }
  const credential = await createUserWithEmailAndPassword(authInstance, email, pass);
  return credential.user;
}

/**
 * Standard Firebase email & password sign in
 */
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const authInstance = await getFirebaseAuth();
  if (!authInstance) {
    throw new Error("Firebase Auth is not initialized or configured.");
  }
  const credential = await signInWithEmailAndPassword(authInstance, email, pass);
  return credential.user;
}

/**
 * Google Authenticator integration popup
 */
export async function signInWithGoogle(): Promise<User> {
  const authInstance = await getFirebaseAuth();
  if (!authInstance) {
    throw new Error("Firebase Auth is not initialized or configured.");
  }
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(authInstance, provider);
  return credential.user;
}

/**
 * Terminate user auth session
 */
export async function logOut(): Promise<void> {
  const authInstance = await getFirebaseAuth();
  if (authInstance) {
    await signOut(authInstance);
  }
}
