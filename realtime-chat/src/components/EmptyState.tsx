import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type EmptyStateProps = {
    title: string;
    description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 32,
    },

    title: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },

    description: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
    },
});
