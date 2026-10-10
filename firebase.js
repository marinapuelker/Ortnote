import './firebase';
import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCloA16VawpD7m35gxIvuTI0UFz-aOLEYY",
  authDomain: "ortnote-fe6da.firebaseapp.com",
  projectId: "ortnote-fe6da",
  storageBucket: "ortnote-fe6da.firebasestorage.app",
  messagingSenderId: "672765916065",
  appId: "1:672765916065:web:22bcf626023dc52ef5d1e0",
  measurementId: "G-XLE09RKDC9"
};

const app = initializeApp(firebaseConfig);
export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export const db = getFirestore(app);