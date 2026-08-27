import { useEffect, useMemo, useState } from 'react';
import { observeUsers } from '../services/userService';
import { ChatUser } from '../types/user';
import { canChatWith } from '../utils/chatRules';
import { getErrorMessage } from '../utils/errors';

export type UseContactsResult = {
  contacts: ChatUser[];
  isLoading: boolean;
  errorMessage: string;
};

type UsersSnapshot = {
  uid: string;
  users: ChatUser[];
  errorMessage: string;
};

const NO_CONTACTS: ChatUser[] = [];

export function useContacts(currentUser: ChatUser | null): UseContactsResult {
  const [snapshot, setSnapshot] = useState<UsersSnapshot | null>(null);

  const currentUid = currentUser?.uid;

  useEffect(() => {
    if (!currentUid) {
      return;
    }

    const unsubscribe = observeUsers(
      (users) => setSnapshot({ uid: currentUid, users, errorMessage: '' }),
      (error) =>
        setSnapshot({
          uid: currentUid,
          users: NO_CONTACTS,
          errorMessage: getErrorMessage(error, 'Não foi possível carregar os contatos.'),
        }),
    );

    return unsubscribe;
  }, [currentUid]);

  const isSynced = snapshot !== null && snapshot.uid === currentUid;

  const contacts = useMemo(() => {
    if (!currentUser || !isSynced || !snapshot) {
      return NO_CONTACTS;
    }

    return snapshot.users
      .filter((user) => user.uid !== currentUser.uid && canChatWith(currentUser.provider, user.provider))
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [snapshot, isSynced, currentUser]);

  return {
    contacts,
    isLoading: Boolean(currentUid) && !isSynced,
    errorMessage: isSynced && snapshot ? snapshot.errorMessage : '',
  };
}
