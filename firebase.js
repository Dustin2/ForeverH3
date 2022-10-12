import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDWgX-sWcTfKJVuxq8zAXZT8Yj5nI1SHzU",
  authDomain: "betafirebase-a9062.firebaseapp.com",
  databaseURL: "https://betafirebase-a9062.firebaseio.com",
  projectId: "betafirebase-a9062",
  storageBucket: "betafirebase-a9062.appspot.com",
  messagingSenderId: "204012253230",
  appId: "1:204012253230:web:eb79c395b4cb8940f3afbf",
  measurementId: "G-YEJX4F991Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {
  auth,
  db
}