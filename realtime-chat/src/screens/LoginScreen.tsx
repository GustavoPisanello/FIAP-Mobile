import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { isAppleAuthAvailable } from '../services/authService';
import { colors } from '../theme/colors';

type FormMode = 'login' | 'register';

export function LoginScreen() {
    const { signUp, signInWithEmail, signInWithGoogle, signInWithApple, isAuthenticating, errorMessage, clearError } =
        useAuth();

    const [mode, setMode] = useState<FormMode>('login');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [validationMessage, setValidationMessage] = useState<string>('');
    const [appleAvailable, setAppleAvailable] = useState<boolean>(false);

    const isRegister = mode === 'register';

    useEffect(() => {
        let active = true;

        isAppleAuthAvailable()
            .then((available) => {
                if (active) {
                    setAppleAvailable(available);
                }
            })
            .catch(() => {
                if (active) {
                    setAppleAvailable(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const feedbackMessage = useMemo(
        () => validationMessage || errorMessage,
        [validationMessage, errorMessage],
    );

    const updateField = useCallback(
        (setter: (value: string) => void) => (value: string) => {
            setter(value);
            setValidationMessage('');
            clearError();
        },
        [clearError],
    );

    const validate = useCallback((): boolean => {
        if (isRegister && !name.trim()) {
            setValidationMessage('Informe seu nome para criar a conta.');
            return false;
        }

        if (!email.trim() || !password.trim()) {
            setValidationMessage('Informe e-mail e senha.');
            return false;
        }

        if (!email.includes('@')) {
            setValidationMessage('Informe um e-mail válido.');
            return false;
        }

        if (password.length < 6) {
            setValidationMessage('A senha deve possuir pelo menos 6 caracteres.');
            return false;
        }

        setValidationMessage('');
        return true;
    }, [isRegister, name, email, password]);

    const handleEmailSubmit = useCallback(async () => {
        if (!validate()) {
            return;
        }

        if (isRegister) {
            await signUp(name.trim(), email.trim(), password);
        } else {
            await signInWithEmail(email.trim(), password);
        }

        setPassword('');
    }, [validate, isRegister, name, email, password, signUp, signInWithEmail]);

    const toggleMode = useCallback(() => {
        setMode((previous) => (previous === 'login' ? 'register' : 'login'));
        setValidationMessage('');
        clearError();
    }, [clearError]);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <Text style={styles.title}>Realtime Chat</Text>
                        <Text style={styles.subtitle}>
                            {isRegister
                                ? 'Crie sua conta com e-mail e senha.'
                                : 'Entre com e-mail e senha, Google ou Apple.'}
                        </Text>
                    </View>

                    <ErrorMessage message={feedbackMessage} />

                    <View style={styles.form}>
                        {isRegister ? (
                            <TextInput
                                style={styles.input}
                                placeholder="Nome"
                                placeholderTextColor={colors.textMuted}
                                value={name}
                                onChangeText={updateField(setName)}
                                autoCapitalize="words"
                                editable={!isAuthenticating}
                            />
                        ) : null}

                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"
                            placeholderTextColor={colors.textMuted}
                            value={email}
                            onChangeText={updateField(setEmail)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            editable={!isAuthenticating}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            placeholderTextColor={colors.textMuted}
                            value={password}
                            onChangeText={updateField(setPassword)}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isAuthenticating}
                        />

                        <AppButton
                            title={isRegister ? 'Criar conta' : 'Entrar'}
                            onPress={handleEmailSubmit}
                            loading={isAuthenticating}
                        />

                        <AppButton
                            title={isRegister ? 'Já tenho conta' : 'Criar uma conta'}
                            onPress={toggleMode}
                            variant="secondary"
                            disabled={isAuthenticating}
                        />
                    </View>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>ou continue com</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.providers}>
                        <AppButton
                            title="Entrar com Google"
                            onPress={signInWithGoogle}
                            variant="google"
                            disabled={isAuthenticating}
                        />

                        {appleAvailable ? (
                            <AppButton
                                title="Entrar com Apple"
                                onPress={signInWithApple}
                                variant="apple"
                                disabled={isAuthenticating}
                            />
                        ) : (
                            <Text style={styles.hint}>
                                O login com Apple está disponível apenas em dispositivos iOS e na versão web.
                            </Text>
                        )}
                    </View>

                    <Text style={styles.rule}>
                        Regra do chat: contas de e-mail/senha conversam somente com contas Google ou Apple.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
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

    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        gap: 20,
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
    },

    header: {
        gap: 6,
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
        color: colors.text,
    },

    subtitle: {
        fontSize: 15,
        color: colors.textMuted,
    },

    form: {
        gap: 12,
    },

    input: {
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.text,
    },

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },

    dividerText: {
        fontSize: 13,
        color: colors.textMuted,
    },

    providers: {
        gap: 12,
    },

    hint: {
        fontSize: 13,
        color: colors.textMuted,
        textAlign: 'center',
    },

    rule: {
        fontSize: 13,
        color: colors.textMuted,
        textAlign: 'center',
    },
});
