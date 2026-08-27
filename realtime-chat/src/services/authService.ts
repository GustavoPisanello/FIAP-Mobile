import {
    GoogleAuthProvider,
    OAuthProvider,
    User as FirebaseUser,
    createUserWithEmailAndPassword,
    signInWithCredential,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { auth } from '../config/firebase';
import { AuthProvider, ChatUser } from '../types/user';
import { saveUserProfile } from './userService';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_DISCOVERY: AuthSession.DiscoveryDocument = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

const PROVIDER_IDS: Record<string, AuthProvider> = {
    password: 'password',
    'google.com': 'google',
    'apple.com': 'apple',
};

function getExtra(key: string): string {
    const extra: Record<string, unknown> = Constants.expoConfig?.extra ?? {};
    const value = extra[key];

    return typeof value === 'string' ? value : '';
}

function getGoogleClientId(): string {
    const platformClientId = Platform.select({
        ios: getExtra('googleClientIdIos'),
        android: getExtra('googleClientIdAndroid'),
        default: getExtra('googleClientIdWeb'),
    });

    const clientId = platformClientId || getExtra('googleClientIdWeb');

    if (!clientId) {
        throw new Error('Client ID do Google não configurado em app.json (expo.extra).');
    }

    return clientId;
}

export function getUserProvider(user: FirebaseUser): AuthProvider {
    const providerId = user.providerData[0]?.providerId ?? 'password';

    return PROVIDER_IDS[providerId] ?? 'password';
}

function resolveName(user: FirebaseUser, provider: AuthProvider, fallbackName?: string): string {
    const candidates = [user.displayName, fallbackName, user.email?.split('@')[0]];
    const name = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);

    if (name) {
        return name.trim();
    }

    return provider === 'apple' ? 'Usuário Apple' : 'Usuário';
}

export function mapFirebaseUser(user: FirebaseUser, fallbackName?: string): ChatUser {
    const provider = getUserProvider(user);

    return {
        uid: user.uid,
        name: resolveName(user, provider, fallbackName),
        email: user.email,
        provider,
    };
}

/** Garante que o usuário autenticado exista no Realtime Database para aparecer na lista de contatos. */
async function syncProfile(user: FirebaseUser, fallbackName?: string): Promise<ChatUser> {
    const chatUser = mapFirebaseUser(user, fallbackName);

    await saveUserProfile(chatUser);

    return chatUser;
}

export async function registerWithEmail(name: string, email: string, password: string): Promise<ChatUser> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(credential.user, { displayName: name });

    return syncProfile(credential.user, name);
}

export async function loginWithEmail(email: string, password: string): Promise<ChatUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    return syncProfile(credential.user);
}

export async function loginWithGoogle(): Promise<ChatUser> {
    if (Platform.OS === 'web') {
        const credential = await signInWithPopup(auth, new GoogleAuthProvider());

        return syncProfile(credential.user);
    }

    const clientId = getGoogleClientId();
    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'realtimechat' });

    const request = new AuthSession.AuthRequest({
        clientId,
        redirectUri,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
    });

    const result = await request.promptAsync(GOOGLE_DISCOVERY);

    if (result.type === 'cancel' || result.type === 'dismiss') {
        throw new Error('Login com Google cancelado.');
    }

    if (result.type !== 'success') {
        throw new Error('Não foi possível concluir o login com Google.');
    }

    const tokens = await AuthSession.exchangeCodeAsync(
        {
            clientId,
            code: result.params.code,
            redirectUri,
            extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
        },
        GOOGLE_DISCOVERY,
    );

    if (!tokens.idToken) {
        throw new Error('O Google não retornou o token de identificação.');
    }

    const firebaseCredential = GoogleAuthProvider.credential(tokens.idToken, tokens.accessToken);
    const credential = await signInWithCredential(auth, firebaseCredential);

    return syncProfile(credential.user);
}

export async function isAppleAuthAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') {
        return true;
    }

    return AppleAuthentication.isAvailableAsync();
}

function createNonce(): string {
    return Array.from(Crypto.getRandomBytes(16), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function loginWithApple(): Promise<ChatUser> {
    if (Platform.OS === 'web') {
        const provider = new OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');

        const credential = await signInWithPopup(auth, provider);

        return syncProfile(credential.user);
    }

    const rawNonce = createNonce();
    const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

    const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
    });

    if (!appleCredential.identityToken) {
        throw new Error('A Apple não retornou o token de identificação.');
    }

    const firebaseCredential = new OAuthProvider('apple.com').credential({
        idToken: appleCredential.identityToken,
        rawNonce,
    });

    const credential = await signInWithCredential(auth, firebaseCredential);

    // A Apple envia o nome apenas no primeiro login da conta.
    const appleName = [appleCredential.fullName?.givenName, appleCredential.fullName?.familyName]
        .filter((part): part is string => typeof part === 'string' && part.length > 0)
        .join(' ');

    return syncProfile(credential.user, appleName || undefined);
}

export async function logout(): Promise<void> {
    await signOut(auth);
}
