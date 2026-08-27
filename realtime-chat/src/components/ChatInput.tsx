import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

type ChatInputProps = {
    onSend: (text: string) => Promise<void>;
    isSending: boolean;
};

export function ChatInput({ onSend, isSending }: ChatInputProps) {
    const [text, setText] = useState<string>('');

    const canSend = text.trim().length > 0 && !isSending;

    const handleSend = useCallback(async () => {
        const message = text.trim();

        if (!message || isSending) {
            return;
        }

        setText('');

        await onSend(message);
    }, [text, isSending, onSend]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Digite sua mensagem"
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={500}
                editable={!isSending}
                onSubmitEditing={handleSend}
                submitBehavior="submit"
            />

            <Pressable
                accessibilityRole="button"
                onPress={handleSend}
                disabled={!canSend}
                style={({ pressed }) => [styles.button, !canSend && styles.buttonDisabled, pressed && styles.pressed]}
            >
                {isSending ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.buttonText}>Enviar</Text>}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
    },

    input: {
        flex: 1,
        maxHeight: 120,
        minHeight: 46,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: colors.text,
        backgroundColor: colors.background,
    },

    button: {
        backgroundColor: colors.primary,
        borderRadius: 22,
        paddingHorizontal: 20,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonDisabled: {
        opacity: 0.5,
    },

    pressed: {
        opacity: 0.8,
    },

    buttonText: {
        color: colors.surface,
        fontSize: 15,
        fontWeight: '700',
    },
});
