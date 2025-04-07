import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZBV-SP1BWg9mAo9N0GTZpSoCd2VZMYpA",
  authDomain: "diaryappdb-2048f.firebaseapp.com",
  projectId: "diaryappdb-2048f",
  storageBucket: "diaryappdb-2048f.firebasestorage.app",
  messagingSenderId: "486900720851",
  appId: "1:486900720851:web:11e9bbe018f1f77e70a026",
  measurementId: "G-4FBV10536F",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };