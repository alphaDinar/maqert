import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getDatabase} from "firebase/database";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKbmFG0NFdZvPyyBHVIuJitJJmdnehn4o",
  authDomain: "smarthotel-7d5d0.firebaseapp.com",
  databaseURL: "https://smarthotel-7d5d0-default-rtdb.firebaseio.com",
  projectId: "smarthotel-7d5d0",
  storageBucket: "smarthotel-7d5d0.appspot.com",
  messagingSenderId: "403532820903",
  appId: "1:403532820903:web:188a1e991f64c7ccaa8682",
  measurementId: "G-2T8GL46KZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const fireAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const realtimeDB = getDatabase(app);
export const fireStoreDB = getFirestore(app);
export const storageDB = getStorage(app);
// export const realtimeDB =  