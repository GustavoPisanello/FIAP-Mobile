import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDYIq5gJy74LjfJxEa9uOAOXFPAf2eEws4",
    authDomain: "espx-mobile-c3feb.firebaseapp.com",
    projectId: "espx-mobile-c3feb",
    storageBucket: "espx-mobile-c3feb.firebasestorage.app",
    messagingSenderId: "971956170202",
    appId: "1:971956170202:web:dc31525003bfbeb6a764e3",
    measurementId: "G-RPZED3CBT6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;