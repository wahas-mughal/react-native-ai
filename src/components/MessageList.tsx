import { useEffect, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import type { Message } from '../types/chat';
import { getChatColors } from '../theme/colors';
import { MessageBubble } from './MessageBubble';

type MessageListProps = {
  messages: Message[];
  isGenerating: boolean;
};

export function MessageList({ messages, isGenerating }: MessageListProps) {
  const listRef = useRef<FlatList<Message>>(null);
  const colors = getChatColors(useColorScheme() === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    listRef.current?.scrollToEnd({ animated: true });
  }, [messages, isGenerating]);

  if (messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: colors.assistantText }]}>
          Apple Intelligence Chat
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.placeholder }]}>
          Ask anything. Responses run on-device with Apple Intelligence.
        </Text>
      </View>
    );
  }

  const visibleMessages = messages.filter(
    message => message.role === 'user' || message.content.length > 0,
  );

  return (
    <FlatList
      ref={listRef}
      data={visibleMessages}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <MessageBubble message={item} />}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      onContentSizeChange={() =>
        listRef.current?.scrollToEnd({ animated: true })
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});
