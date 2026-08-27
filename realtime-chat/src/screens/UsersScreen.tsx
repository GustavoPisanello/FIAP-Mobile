import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { UserItem } from '../components/UserItem';
import { useAuth } from '../hooks/useAuth';
import { useContacts } from '../hooks/useContacts';
import { ChatUser } from '../types/user';
import { colors } from '../theme/colors';
import { getAllowedProviders, getProviderLabel } from '../utils/chatRules';

export function UsersScreen() {
    const router = useRouter();
    const { user, signOut, errorMessage: authErrorMessage } = useAuth();
    const { contacts, isLoading, errorMessage } = useContacts(user);

    const openChat = useCallback(
        (contact: ChatUser) => {
            router.push(`/chat/${contact.uid}`);
        },
        [router],
    );

    if (!user) {
        return <Loading fullScreen label="Carregando usuário..." />;
    }

    const allowedLabels = getAllowedProviders(user.provider).map(getProviderLabel).join(' ou ');

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <View style={styles.headerInfo}>
                    <Text style={styles.greeting} numberOfLines={1}>
                        Olá, {user.name}
                    </Text>
                    <Text style={styles.provider}>Conectado via {getProviderLabel(user.provider)}</Text>
                </View>

                <Pressable
                    accessibilityRole="button"
                    onPress={signOut}
                    style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
                >
                    <Text style={styles.logoutText}>Sair</Text>
                </Pressable>
            </View>

            <View style={styles.body}>
                <Text style={styles.sectionTitle}>Contatos disponíveis</Text>
                <Text style={styles.sectionDescription}>
                    Você pode conversar apenas com usuários autenticados via {allowedLabels}.
                </Text>

                <ErrorMessage message={errorMessage || authErrorMessage} />

                {isLoading ? (
                    <Loading label="Carregando contatos..." />
                ) : (
                    <FlatList
                        data={contacts}
                        keyExtractor={(item) => item.uid}
                        renderItem={({ item }) => <UserItem user={item} onPress={openChat} />}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <EmptyState
                                title="Nenhum contato disponível"
                                description={`Ainda não há usuários autenticados via ${allowedLabels}. Faça login com outro provedor em outro dispositivo para começar uma conversa.`}
                            />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    headerInfo: {
        flex: 1,
        gap: 2,
    },

    greeting: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text,
    },

    provider: {
        fontSize: 13,
        color: colors.textMuted,
    },

    logout: {
        borderWidth: 1,
        borderColor: colors.danger,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    pressed: {
        opacity: 0.7,
    },

    logoutText: {
        color: colors.danger,
        fontWeight: '700',
    },

    body: {
        flex: 1,
        padding: 20,
        gap: 8,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text,
    },

    sectionDescription: {
        fontSize: 13,
        color: colors.textMuted,
        marginBottom: 4,
    },

    list: {
        gap: 10,
        paddingBottom: 24,
    },
});
