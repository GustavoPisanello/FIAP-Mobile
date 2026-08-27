import { StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../types/chat';
import { colors } from '../theme/colors';

type MessageBubbleProps = {
  message: ChatMessage;
  isOwn: boolean;
};

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.text, isOwn ? styles.textOwn : styles.textOther]}>{message.text}</Text>
        <Text style={[styles.time, isOwn ? styles.timeOwn : styles.timeOther]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  rowOwn: {
    justifyContent: 'flex-end',
  },

  rowOther: {
    justifyContent: 'flex-start',
  },

  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },

  bubbleOwn: {
    backgroundColor: colors.ownBubble,
    borderBottomRightRadius: 4,
  },

  bubbleOther: {
    backgroundColor: colors.otherBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },

  text: {
    fontSize: 15,
    lineHeight: 20,
  },

  textOwn: {
    color: colors.ownBubbleText,
  },

  textOther: {
    color: colors.otherBubbleText,
  },

  time: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },

  timeOwn: {
    color: 'rgba(255, 255, 255, 0.75)',
  },

  timeOther: {
    color: colors.textMuted,
  },
});
