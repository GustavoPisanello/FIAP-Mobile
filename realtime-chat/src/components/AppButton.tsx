import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'google' | 'apple';

type AppButtonProps = {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
};

const VARIANT_STYLES: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary },
    google: { backgroundColor: colors.google },
    apple: { backgroundColor: colors.apple },
};

export function AppButton({ title, onPress, variant = 'primary', disabled = false, loading = false }: AppButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.button,
                VARIANT_STYLES[variant],
                pressed && styles.pressed,
                isDisabled && styles.disabled,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'secondary' ? colors.primary : colors.surface} />
            ) : (
                <Text style={[styles.title, variant === 'secondary' && styles.titleSecondary]}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },

    pressed: {
        opacity: 0.8,
    },

    disabled: {
        opacity: 0.5,
    },

    title: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: '700',
    },

    titleSecondary: {
        color: colors.primary,
    },
});
