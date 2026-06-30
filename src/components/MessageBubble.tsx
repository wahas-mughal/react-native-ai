import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import type { Message } from '../types/chat';
import { getChatColors } from '../theme/colors';

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const colors = getChatColors(useColorScheme() === 'dark' ? 'dark' : 'light');

  return (
    <View
      style={[
        styles.row,
        isUser ? styles.rowUser : styles.rowAssistant,
      ]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? colors.userBubble : colors.assistantBubble,
          },
        ]}>
        <Text
          style={[
            styles.text,
            { color: isUser ? colors.userText : colors.assistantText },
          ]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  rowAssistant: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});
