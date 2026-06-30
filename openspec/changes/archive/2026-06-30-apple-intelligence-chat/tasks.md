## 1. Setup

- [x] 1.1 Install `ai` package (Vercel AI SDK v5) via npm
- [x] 1.2 Create `src/types/chat.ts` with `Message` type (`id`, `role`, `content`)
- [x] 1.3 Create `src/theme/colors.ts` with light/dark color tokens for bubbles and background

## 2. AI Integration

- [x] 2.1 Create `src/hooks/useChat.ts` — message state, `isAvailable`, `isGenerating`, `error` state
- [x] 2.2 Implement availability check on mount (`Platform.OS === 'ios'` then `apple.isAvailable()`)
- [x] 2.3 Implement `sendMessage(text)` — append user message, call `streamText({ model: apple(), messages, system })`, stream chunks into assistant message
- [x] 2.4 Handle errors in sendMessage — set error state, re-enable input
- [x] 2.5 Disable send while `isGenerating` is true

## 3. UI Components

- [x] 3.1 Create `MessageBubble.tsx` — role-based alignment, bubble colors from theme, dark mode via `useColorScheme`
- [x] 3.2 Create `TypingIndicator.tsx` — animated dots shown while streaming
- [x] 3.3 Create `MessageList.tsx` — FlatList of messages, empty state welcome text, auto-scroll on new messages
- [x] 3.4 Create `ChatInput.tsx` — TextInput, send button, disabled when empty/unavailable/generating
- [x] 3.5 Create `UnavailableBanner.tsx` — explains iOS 26+ / Apple Intelligence requirement (or Android unsupported)

## 4. Chat Screen

- [x] 4.1 Create `ChatScreen.tsx` — compose MessageList, ChatInput, UnavailableBanner, TypingIndicator
- [x] 4.2 Add KeyboardAvoidingView and SafeAreaView for proper keyboard/safe-area handling
- [x] 4.3 Wire `useChat` hook to components

## 5. App Integration

- [x] 5.1 Update `App.tsx` — replace NewAppScreen with ChatScreen, keep SafeAreaProvider
- [x] 5.2 Remove unused `@react-native/new-app-screen` import

## 6. Verification

- [x] 6.1 Build and run on iOS simulator (iOS 26+ if available)
- [x] 6.2 Verify: send message → streaming response appears in assistant bubble
- [x] 6.3 Verify: unavailable state shows banner and disables input on Android or unsupported iOS
- [x] 6.4 Verify: dark mode colors render correctly
