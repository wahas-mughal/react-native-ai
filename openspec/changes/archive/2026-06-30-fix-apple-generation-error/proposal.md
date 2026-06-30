## Why

Sending any chat message triggers `FoundationModels.LanguageModelSession.GenerationError error -1`, causing the app to fail on every generation attempt. The chat UI and polyfills work, but the AI integration layer has compatibility and API-format issues that prevent successful responses.

## What Changes

- Pin `ai` package to **v6** (required by `@react-native-ai/apple` 0.12 — currently on incompatible v7)
- Refactor `useChat` to match official react-native-ai message format (system as first message in `messages`, not separate `system` param)
- Switch to `fullStream` error handling per provider docs; surface errors in UI without red LogBox overlay
- Add `generateText` fallback when streaming fails
- Add typed error handling via `AppleLLMErrorCodes` for actionable user messages
- Document simulator/Mac Apple Intelligence setup requirements in README

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `apple-intelligence-chat`: Fix generation reliability, SDK compatibility, error handling, and fallback behavior
- `chat-ui`: Show actionable error messages instead of dev-only console overlay for handled failures

## Impact

- **Dependencies**: `ai` downgraded from v7 to v6
- **Code**: `src/hooks/useChat.ts`, possibly `ChatScreen.tsx` for error display
- **Docs**: README troubleshooting section for simulator setup
- **Risk**: AI SDK v6 API may differ slightly from v7 imports — verify `streamText`/`generateText` signatures
