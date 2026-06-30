import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInput } from '../components/ChatInput';
import { MessageList } from '../components/MessageList';
import { TypingIndicator } from '../components/TypingIndicator';
import { UnavailableBanner } from '../components/UnavailableBanner';
import { useChat } from '../hooks/useChat';
import { getChatColors } from '../theme/colors';

export function ChatScreen() {
  const colors = getChatColors(useColorScheme() === 'dark' ? 'dark' : 'light');
  const { messages, isAvailable, isGenerating, error, sendMessage } = useChat();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        {!isAvailable ? <UnavailableBanner /> : null}

        <View style={styles.messages}>
          <MessageList messages={messages} isGenerating={isGenerating} />
          {isGenerating &&
          messages[messages.length - 1]?.role === 'assistant' &&
          messages[messages.length - 1]?.content.length === 0 ? (
            <TypingIndicator />
          ) : null}
        </View>

        {error ? (
          <Text style={[styles.error, { color: colors.bannerText }]}>
            {error}
          </Text>
        ) : null}

        <ChatInput
          onSend={sendMessage}
          disabled={!isAvailable}
          isGenerating={isGenerating}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  messages: {
    flex: 1,
  },
  error: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
