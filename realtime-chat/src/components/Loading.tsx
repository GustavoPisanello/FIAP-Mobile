import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type LoadingProps = {
  label?: string;
  fullScreen?: boolean;
};

export function Loading({ label, fullScreen = false }: LoadingProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },

  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  label: {
    color: colors.textMuted,
    fontSize: 15,
  },
});
