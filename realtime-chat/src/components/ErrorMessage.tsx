import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerSurface,
    borderRadius: 10,
    padding: 12,
  },

  text: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
});
