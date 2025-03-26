import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_v6X4zH9RC0Cjggqg1n1KJpkdJNCRzVk",
  authDomain: "stormify-363d8.firebaseapp.com",
  projectId: "stormify-363d8",
  storageBucket: "stormify-363d8.appspot.com",
  messagingSenderId: "3303086765",
  appId: "1:3303086765:web:7f0596e23691b754740424",
  measurementId: "G-Q1CHSXY7BF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
