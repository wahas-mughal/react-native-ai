export type ColorScheme = 'light' | 'dark';

export type ChatColors = {
  background: string;
  userBubble: string;
  assistantBubble: string;
  userText: string;
  assistantText: string;
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  placeholder: string;
  sendButton: string;
  sendButtonDisabled: string;
  bannerBackground: string;
  bannerText: string;
  typingDot: string;
};

const light: ChatColors = {
  background: '#F2F2F7',
  userBubble: '#007AFF',
  assistantBubble: '#E5E5EA',
  userText: '#FFFFFF',
  assistantText: '#000000',
  inputBackground: '#FFFFFF',
  inputBorder: '#C7C7CC',
  inputText: '#000000',
  placeholder: '#8E8E93',
  sendButton: '#007AFF',
  sendButtonDisabled: '#C7C7CC',
  bannerBackground: '#FFF3CD',
  bannerText: '#664D03',
  typingDot: '#8E8E93',
};

const dark: ChatColors = {
  background: '#000000',
  userBubble: '#0A84FF',
  assistantBubble: '#1C1C1E',
  userText: '#FFFFFF',
  assistantText: '#FFFFFF',
  inputBackground: '#1C1C1E',
  inputBorder: '#38383A',
  inputText: '#FFFFFF',
  placeholder: '#8E8E93',
  sendButton: '#0A84FF',
  sendButtonDisabled: '#48484A',
  bannerBackground: '#3A2F00',
  bannerText: '#FFD60A',
  typingDot: '#8E8E93',
};

export function getChatColors(scheme: ColorScheme): ChatColors {
  return scheme === 'dark' ? dark : light;
}
