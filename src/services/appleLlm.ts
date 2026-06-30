import { AppleFoundationModels } from '@react-native-ai/apple';

export type AppleModelMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type TextPart = { type: 'text'; text: string };

function extractText(
  parts: Array<
    | TextPart
    | { type: 'tool-call'; toolName: string; input: string }
    | { type: 'tool-result'; toolName: string; output: string }
  >,
): string {
  return parts
    .filter((part): part is TextPart => part.type === 'text')
    .map(part => part.text)
    .join('');
}

export function isAppleIntelligenceAvailable(): boolean {
  try {
    return AppleFoundationModels.isAvailable();
  } catch {
    return false;
  }
}

export function buildAppleMessages(
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  userContent: string,
): AppleModelMessage[] {
  if (history.length === 0) {
    return [{ role: 'user', content: userContent }];
  }

  return [
    ...history.map(message => ({
      role: message.role,
      content: message.content,
    })),
    { role: 'user', content: userContent },
  ];
}

export async function generateAppleText(
  messages: AppleModelMessage[],
): Promise<string> {
  const parts = await AppleFoundationModels.generateText(messages, {});
  return extractText(parts);
}

export function streamAppleText(
  messages: AppleModelMessage[],
  onDelta: (text: string) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let previousContent = '';
    let streamId: string;

    try {
      streamId = AppleFoundationModels.generateStream(messages, {});
    } catch (error) {
      reject(error);
      return;
    }

    const updateListener = AppleFoundationModels.onStreamUpdate(data => {
      if (data.streamId !== streamId) {
        return;
      }

      const delta = data.content.slice(previousContent.length);
      previousContent = data.content;
      if (delta.length > 0) {
        onDelta(delta);
      }
    });

    const completeListener = AppleFoundationModels.onStreamComplete(data => {
      if (data.streamId !== streamId) {
        return;
      }

      cleanup();
      resolve();
    });

    const errorListener = AppleFoundationModels.onStreamError(data => {
      if (data.streamId !== streamId) {
        return;
      }

      cleanup();
      reject(new Error(data.error));
    });

    function cleanup() {
      updateListener.remove();
      completeListener.remove();
      errorListener.remove();
    }
  });
}
