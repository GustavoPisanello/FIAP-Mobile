import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDZE5PWEJ4ZTLQEZm3YSoCP2Vaq8EZ94OE",
    authDomain: "realtime-chat-c9c21.firebaseapp.com",
    databaseURL: "https://realtime-chat-c9c21-default-rtdb.firebaseio.com",
    projectId: "realtime-chat-c9c21",
    storageBucket: "realtime-chat-c9c21.firebasestorage.app",
    messagingSenderId: "770526641984",
    appId: "1:770526641984:web:49aa767434246c2e4084a5",
    measurementId: "G-HHSQJSKTC7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;