## Why

The project ships with `@react-native-ai/apple` installed but still shows the default React Native template. Users need a working chat experience that leverages on-device Apple Intelligence for private, offline-capable conversations with a polished mobile UX.

## What Changes

- Replace the default `NewAppScreen` template with a chat interface
- Integrate `@react-native-ai/apple` with the Vercel AI SDK (`ai` package) for text generation
- Stream assistant responses token-by-token for a responsive feel
- Handle device availability (iOS 26+, Apple Intelligence enabled) with clear user messaging
- Add loading, error, and empty states for a complete chat experience
- Install missing dependency: `ai` (Vercel AI SDK v5, required by the Apple provider)

## Capabilities

### New Capabilities

- `apple-intelligence-chat`: On-device chat powered by Apple Foundation Models — message send/receive, streaming responses, availability checks, and error handling
- `chat-ui`: Chat screen layout — message bubbles, input bar, keyboard handling, scroll behavior, and visual states (empty, loading, error)

### Modified Capabilities

- (none — greenfield project with no existing specs)

## Impact

- **App entry**: `App.tsx` — replace template with chat screen
- **New source files**: chat screen, message components, chat hook/service layer
- **Dependencies**: add `ai` package; existing `@react-native-ai/apple` already installed
- **Platform**: iOS-only for AI functionality (Android shows unsupported-state message)
- **Requirements**: iOS 26+, Apple Intelligence device, React Native New Architecture
