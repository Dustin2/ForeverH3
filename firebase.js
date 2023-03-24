import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeRd-wo_TnqXXSNyD0LGX_XWVfWwVqOFo",
  authDomain: "cemento-da437.firebaseapp.com",
  projectId: "cemento-da437",
  storageBucket: "cemento-da437.appspot.com",
  messagingSenderId: "278041417919",
  appId: "1:278041417919:web:6108c6c13f6cba53ca4e0a",
  measurementId: "G-KRHZRS1RJV",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
