import { DataSnapshot, get, limitToLast, onValue, orderByChild, push, query, ref, set } from 'firebase/database';
import { database } from '../config/firebase';
import { ChatMessage, Conversation } from '../types/chat';
import { buildConversationId } from '../utils/chatRules';

const CONVERSATIONS_PATH = 'conversations';
const MESSAGES_PATH = 'messages';
const MESSAGES_LIMIT = 200;

export type NewMessage = {
    conversationId: string;
    senderId: string;
    receiverId: string;
    text: string;
};

function parseMessage(conversationId: string, id: string, value: unknown): ChatMessage | null {
    if (typeof value !== 'object' || value === null) {
        return null;
    }

    const record: Record<string, unknown> = { ...value };

    if (
        typeof record.senderId !== 'string' ||
        typeof record.receiverId !== 'string' ||
        typeof record.text !== 'string' ||
        typeof record.createdAt !== 'number'
    ) {
        return null;
    }

    return {
        id,
        conversationId,
        senderId: record.senderId,
        receiverId: record.receiverId,
        text: record.text,
        createdAt: record.createdAt,
    };
}

function parseMessageList(conversationId: string, snapshot: DataSnapshot): ChatMessage[] {
    const messages: ChatMessage[] = [];

    snapshot.forEach((child) => {
        if (!child.key) {
            return;
        }

        const message = parseMessage(conversationId, child.key, child.val() as unknown);

        if (message) {
            messages.push(message);
        }
    });

    return messages.sort((a, b) => a.createdAt - b.createdAt);
}

/** Localiza a conversa entre os dois usuários ou cria uma nova (sempre com exatamente 2 participantes). */
export async function ensureConversation(currentUid: string, otherUid: string): Promise<Conversation> {
    const id = buildConversationId(currentUid, otherUid);
    const conversationRef = ref(database, `${CONVERSATIONS_PATH}/${id}`);
    const snapshot = await get(conversationRef);

    const participants: [string, string] = [currentUid, otherUid].sort() as [string, string];

    if (snapshot.exists()) {
        const stored: Record<string, unknown> = { ...(snapshot.val() as object) };
        const createdAt = typeof stored.createdAt === 'number' ? stored.createdAt : Date.now();

        return { id, participants, createdAt };
    }

    const conversation: Conversation = { id, participants, createdAt: Date.now() };

    await set(conversationRef, {
        participants: conversation.participants,
        createdAt: conversation.createdAt,
    });

    return conversation;
}

export async function sendMessage(message: NewMessage): Promise<void> {
    const text = message.text.trim();

    if (!text) {
        throw new Error('A mensagem não pode estar vazia.');
    }

    const messageRef = push(ref(database, `${MESSAGES_PATH}/${message.conversationId}`));

    await set(messageRef, {
        senderId: message.senderId,
        receiverId: message.receiverId,
        text,
        createdAt: Date.now(),
    });
}

/** Escuta as mensagens da conversa em tempo real. Retorna a função que remove o listener. */
export function observeMessages(
    conversationId: string,
    onMessagesChange: (messages: ChatMessage[]) => void,
    onFailure: (error: Error) => void,
): () => void {
    const messagesQuery = query(
        ref(database, `${MESSAGES_PATH}/${conversationId}`),
        orderByChild('createdAt'),
        limitToLast(MESSAGES_LIMIT),
    );

    return onValue(
        messagesQuery,
        (snapshot) => onMessagesChange(parseMessageList(conversationId, snapshot)),
        onFailure,
    );
}
