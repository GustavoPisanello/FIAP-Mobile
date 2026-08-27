import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChatUser } from '../types/user';
import { getProviderLabel } from '../utils/chatRules';
import { colors } from '../theme/colors';

type UserItemProps = {
  user: ChatUser;
  onPress: (user: ChatUser) => void;
};

export function UserItem({ user, onPress }: UserItemProps) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(user)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email ?? 'E-mail não informado'}
        </Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{getProviderLabel(user.provider)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },

  pressed: {
    opacity: 0.7,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '700',
  },

  info: {
    flex: 1,
    gap: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },

  email: {
    fontSize: 13,
    color: colors.textMuted,
  },

  badge: {
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
