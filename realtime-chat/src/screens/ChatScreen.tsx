import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChatInput } from '../components/ChatInput';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { MessageBubble } from '../components/MessageBubble';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { fetchUser } from '../services/userService';
import { ChatUser } from '../types/user';
import { colors } from '../theme/colors';
import { canChatWith, getProviderLabel } from '../utils/chatRules';
import { getErrorMessage } from '../utils/errors';

type ChatScreenProps = {
    contactId: string;
};

type LoadedContact = {
    contactId: string;
    contact: ChatUser | null;
    errorMessage: string;
};

export function ChatScreen({ contactId }: ChatScreenProps) {
    const router = useRouter();
    const { user } = useAuth();

    const [loadedContact, setLoadedContact] = useState<LoadedContact | null>(null);

    useEffect(() => {
        let active = true;

        fetchUser(contactId)
            .then((foundUser) => {
                if (active) {
                    setLoadedContact({
                        contactId,
                        contact: foundUser,
                        errorMessage: foundUser ? '' : 'Usuário não encontrado.',
                    });
                }
            })
            .catch((error: unknown) => {
                if (active) {
                    setLoadedContact({
                        contactId,
                        contact: null,
                        errorMessage: getErrorMessage(error, 'Não foi possível carregar o contato.'),
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [contactId]);

    const isContactLoaded = loadedContact !== null && loadedContact.contactId === contactId;
    const contact = isContactLoaded ? loadedContact.contact : null;
    const contactError = isContactLoaded ? loadedContact.errorMessage : '';

    const isAllowed = useMemo(() => {
        if (!user || !contact) {
            return false;
        }

        return contact.uid !== user.uid && canChatWith(user.provider, contact.provider);
    }, [user, contact]);

    const { messages, isLoading, isSending, errorMessage, send } = useChat(user, isAllowed ? contact : null);

    // FlatList invertida: mensagens mais recentes primeiro, com rolagem automática.
    const invertedMessages = useMemo(() => [...messages].reverse(), [messages]);

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
            return;
        }

        router.replace('/users');
    }, [router]);

    if (!isContactLoaded) {
        return <Loading fullScreen label="Abrindo conversa..." />;
    }

    const blockedMessage = contactError || (!isAllowed ? 'Esta conversa não é permitida pela regra de provedores.' : '');

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Pressable
                    accessibilityRole="button"
                    onPress={goBack}
                    style={({ pressed }) => [styles.back, pressed && styles.pressed]}
                >
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>

                <View style={styles.headerInfo}>
                    <Text style={styles.name} numberOfLines={1}>
                        {contact?.name ?? 'Conversa'}
                    </Text>
                    {contact ? (
                        <Text style={styles.provider}>Autenticado via {getProviderLabel(contact.provider)}</Text>
                    ) : null}
                </View>
            </View>

            {blockedMessage ? (
                <View style={styles.blocked}>
                    <ErrorMessage message={blockedMessage} />
                </View>
            ) : (
                <KeyboardAvoidingView
                    style={styles.flex}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
                >
                    <View style={styles.flex}>
                        {errorMessage ? (
                            <View style={styles.errorArea}>
                                <ErrorMessage message={errorMessage} />
                            </View>
                        ) : null}

                        {isLoading ? (
                            <Loading label="Carregando mensagens..." />
                        ) : messages.length === 0 ? (
                            <EmptyState
                                title="Nenhuma mensagem ainda"
                                description={`Envie a primeira mensagem para ${contact?.name ?? 'este contato'}.`}
                            />
                        ) : (
                            <FlatList
                                data={invertedMessages}
                                inverted
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <MessageBubble message={item} isOwn={item.senderId === user?.uid} />
                                )}
                                contentContainerStyle={styles.list}
                            />
                        )}
                    </View>

                    <ChatInput onSend={send} isSending={isSending} />
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    flex: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    back: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },

    pressed: {
        opacity: 0.7,
    },

    backText: {
        color: colors.primary,
        fontWeight: '700',
    },

    headerInfo: {
        flex: 1,
        gap: 2,
    },

    name: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
    },

    provider: {
        fontSize: 12,
        color: colors.textMuted,
    },

    blocked: {
        padding: 20,
    },

    errorArea: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },

    list: {
        padding: 16,
    },
});
