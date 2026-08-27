import { DataSnapshot, get, onValue, ref, set, update } from 'firebase/database';
import { database } from '../config/firebase';
import { AuthProvider, ChatUser } from '../types/user';

const USERS_PATH = 'users';

function isAuthProvider(value: unknown): value is AuthProvider {
    return value === 'password' || value === 'google' || value === 'apple';
}

function parseUser(uid: string, value: unknown): ChatUser | null {
    if (typeof value !== 'object' || value === null) {
        return null;
    }

    const record: Record<string, unknown> = { ...value };

    if (!isAuthProvider(record.provider)) {
        return null;
    }

    const name = typeof record.name === 'string' && record.name.trim().length > 0 ? record.name : 'Usuário';
    const email = typeof record.email === 'string' ? record.email : null;

    return { uid, name, email, provider: record.provider };
}

function parseUserList(snapshot: DataSnapshot): ChatUser[] {
    const users: ChatUser[] = [];

    snapshot.forEach((child) => {
        if (!child.key) {
            return;
        }

        const user = parseUser(child.key, child.val() as unknown);

        if (user) {
            users.push(user);
        }
    });

    return users;
}

/** Cria o perfil do usuário no Realtime Database ou atualiza os dados vindos do provedor. */
export async function saveUserProfile(user: ChatUser): Promise<void> {
    const userRef = ref(database, `${USERS_PATH}/${user.uid}`);
    const snapshot = await get(userRef);

    const profile = {
        name: user.name,
        email: user.email,
        provider: user.provider,
    };

    if (snapshot.exists()) {
        await update(userRef, profile);
        return;
    }

    await set(userRef, { ...profile, createdAt: Date.now() });
}

/** Escuta a lista de usuários em tempo real. Retorna a função que remove o listener. */
export function observeUsers(
    onUsersChange: (users: ChatUser[]) => void,
    onFailure: (error: Error) => void,
): () => void {
    const usersRef = ref(database, USERS_PATH);

    return onValue(
        usersRef,
        (snapshot) => onUsersChange(parseUserList(snapshot)),
        onFailure,
    );
}

export async function fetchUser(uid: string): Promise<ChatUser | null> {
    const snapshot = await get(ref(database, `${USERS_PATH}/${uid}`));

    return parseUser(uid, snapshot.val() as unknown);
}
