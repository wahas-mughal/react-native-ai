import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { Message } from '../types/chat';
import {
  buildAppleMessages,
  generateAppleText,
  isAppleIntelligenceAvailable,
} from '../services/appleLlm';

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatGenerationError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);

  if (message.includes('not available')) {
    return 'Apple Intelligence is not available on this device.';
  }

  if (message.includes('GenerationError error -1')) {
    return 'Apple Intelligence models are not loaded on your Mac. Enable Apple Intelligence in System Settings, wait a few minutes for downloads, then restart the simulator.';
  }

  if (__DEV__) {
    return message || 'Failed to generate a response.';
  }

  return message || 'Failed to generate a response.';
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      setIsAvailable(false);
      return;
    }

    setIsAvailable(isAppleIntelligenceAvailable());
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isGenerating || !isAvailable) {
        return;
      }

      setError(null);
      setIsGenerating(true);

      const userMessage: Message = {
        id: createId(),
        role: 'user',
        content: trimmed,
      };

      const assistantMessageId = createId();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
      };

      setMessages(current => [...current, userMessage, assistantMessage]);

      const appleMessages = buildAppleMessages(messages, trimmed);

      const handleFailure = (err: unknown) => {
        setError(formatGenerationError(err));
        setMessages(current =>
          current.filter(item => item.id !== assistantMessageId),
        );
      };

      try {
        const text = await generateAppleText(appleMessages);

        if (!text.trim()) {
          throw new Error('Apple Intelligence returned an empty response.');
        }

        setMessages(current =>
          current.map(message =>
            message.id === assistantMessageId
              ? { ...message, content: text }
              : message,
          ),
        );
      } catch (err) {
        handleFailure(err);
      } finally {
        setIsGenerating(false);
      }
    },
    [isAvailable, isGenerating, messages],
  );

  return {
    messages,
    isAvailable,
    isGenerating,
    error,
    sendMessage,
  };
}
