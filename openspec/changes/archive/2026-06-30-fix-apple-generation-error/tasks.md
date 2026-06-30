## 1. Dependency Fix

- [x] 1.1 Downgrade `ai` package from v7 to `^6.0.0` in package.json
- [x] 1.2 Run `npm install` and verify no peer dependency conflicts
- [x] 1.3 Run `npx tsc --noEmit` to confirm types compile

## 2. Message Format Fix

- [x] 2.1 Refactor `useChat.ts` to pass system prompt as first `messages` entry (`role: 'system'`) instead of separate `system` param
- [x] 2.2 Ensure last message in array is always `role: 'user'` per Apple native requirements
- [x] 2.3 Build conversation history as alternating user/assistant messages

## 3. Streaming & Fallback

- [x] 3.1 Switch from `textStream`-only to `fullStream` loop for text deltas and error parts
- [x] 3.2 Add `generateText` fallback when streaming fails
- [x] 3.3 Use `AppleLLMErrorCodes` for typed error classification in `formatGenerationError`

## 4. Error UX

- [x] 4.1 Prevent unhandled LogBox overlay — avoid `console.error` in custom onError; add `LogBox.ignoreLogs` for FoundationModels pattern
- [x] 4.2 Show actionable inline error in ChatScreen (already exists, verify messages are user-friendly)
- [x] 4.3 Clear error state when user sends a new message

## 5. Documentation

- [x] 5.1 Add README section: Apple Intelligence simulator requirements (macOS 26+, AI enabled, version alignment)
- [x] 5.2 Document recommended run command: `npm run ios -- --simulator "iPhone 17 Pro"`

## 6. Verification

- [x] 6.1 Clear Metro cache and rebuild iOS app
- [x] 6.2 Send a test message — verify no GenerationError -1 (or friendly error if env issue)
- [x] 6.3 Verify streaming response appears in assistant bubble
- [x] 6.4 Verify no red LogBox overlay for handled errors
