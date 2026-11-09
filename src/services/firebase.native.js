// AI-assisted: see docs/AI_LOG.md #1
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './firebaseConfig';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
let auth;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  auth = getAuth(app);
}
export { auth };
export const db = getFirestore(app);