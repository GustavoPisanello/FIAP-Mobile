import { useCallback, useEffect, useMemo, useState } from 'react';
import { ensureConversation, observeMessages, sendMessage } from '../services/chatService';
import { ChatMessage } from '../types/chat';
import { ChatUser } from '../types/user';
import { buildConversationId } from '../utils/chatRules';
import { getErrorMessage } from '../utils/errors';

export type UseChatResult = {
  conversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  errorMessage: string;
  send: (text: string) => Promise<void>;
};

type ChatSnapshot = {
  conversationId: string;
  messages: ChatMessage[];
  errorMessage: string;
};

const NO_MESSAGES: ChatMessage[] = [];

export function useChat(currentUser: ChatUser | null, contact: ChatUser | null): UseChatResult {
  const [snapshot, setSnapshot] = useState<ChatSnapshot | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string>('');

  const conversationId = useMemo(
    () => (currentUser && contact ? buildConversationId(currentUser.uid, contact.uid) : null),
    [currentUser, contact],
  );

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const unsubscribe = observeMessages(
      conversationId,
      (messages) => setSnapshot({ conversationId, messages, errorMessage: '' }),
      (error) =>
        setSnapshot({
          conversationId,
          messages: NO_MESSAGES,
          errorMessage: getErrorMessage(error, 'Não foi possível carregar as mensagens.'),
        }),
    );

    return unsubscribe;
  }, [conversationId]);

  const isSynced = snapshot !== null && snapshot.conversationId === conversationId;

  const send = useCallback(
    async (text: string) => {
      if (!currentUser || !contact || !conversationId) {
        return;
      }

      try {
        setIsSending(true);
        setSendError('');

        await ensureConversation(currentUser.uid, contact.uid);

        await sendMessage({
          conversationId,
          senderId: currentUser.uid,
          receiverId: contact.uid,
          text,
        });
      } catch (error) {
        setSendError(getErrorMessage(error, 'Não foi possível enviar a mensagem.'));
      } finally {
        setIsSending(false);
      }
    },
    [currentUser, contact, conversationId],
  );

  return {
    conversationId,
    messages: isSynced ? snapshot.messages : NO_MESSAGES,
    isLoading: conversationId !== null && !isSynced,
    isSending,
    errorMessage: sendError || (isSynced ? snapshot.errorMessage : ''),
    send,
  };
}
