import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { getChatColors } from '../theme/colors';

type ChatInputProps = {
  onSend: (text: string) => void;
  disabled: boolean;
  isGenerating: boolean;
};

export function ChatInput({ onSend, disabled, isGenerating }: ChatInputProps) {
  const [text, setText] = useState('');
  const colors = getChatColors(useColorScheme() === 'dark' ? 'dark' : 'light');
  const canSend = !disabled && !isGenerating && text.trim().length > 0;

  const handleSend = () => {
    if (!canSend) {
      return;
    }

    onSend(text);
    setText('');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.inputBorder,
        },
      ]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            color: colors.inputText,
          },
        ]}
        placeholder="Message"
        placeholderTextColor={colors.placeholder}
        value={text}
        onChangeText={setText}
        editable={!disabled && !isGenerating}
        multiline
        maxLength={2000}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        submitBehavior='blurAndSubmit'
      />
      <Pressable
        style={[
          styles.sendButton,
          {
            backgroundColor: canSend
              ? colors.sendButton
              : colors.sendButtonDisabled,
          },
        ]}
        onPress={handleSend}
        disabled={!canSend}>
        <Text style={styles.sendLabel}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    minWidth: 64,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  sendLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
