import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
    apiKey: 'AIzaSyDZE5PWEJ4ZTLQEZm3YSoCP2Vaq8EZ94OE',
    authDomain: 'realtime-chat-c9c21.firebaseapp.com',
    databaseURL: 'https://realtime-chat-c9c21-default-rtdb.firebaseio.com',
    projectId: 'realtime-chat-c9c21',
    storageBucket: 'realtime-chat-c9c21.firebasestorage.app',
    messagingSenderId: '770526641984',
    appId: '1:770526641984:web:49aa767434246c2e4084a5',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function createAuth(): Auth {
    // Na web o getAuth já entrega persistência local e o resolver de popup que o
    // signInWithPopup (Google/Apple) exige — o initializeAuth não inclui esse resolver.
    if (Platform.OS === 'web') {
        return getAuth(app);
    }

    // initializeAuth só pode rodar uma vez por app; o Fast Refresh reavalia este módulo.
    try {
        return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
    } catch {
        return getAuth(app);
    }
}

export const auth = createAuth();

export const database = getDatabase(app);

export default app;
