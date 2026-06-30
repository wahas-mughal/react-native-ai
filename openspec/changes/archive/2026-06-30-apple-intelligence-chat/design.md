## Context

The app is a fresh React Native 0.86 project with `@react-native-ai/apple` (^0.12.0) installed but unused. The default `NewAppScreen` template is still the entry point. The Apple provider integrates with the Vercel AI SDK (`ai` package, v5+) and requires iOS 26+, an Apple Intelligence-enabled device, and React Native New Architecture.

The user wants a chat app that sends messages to on-device Apple Intelligence and displays responses in a clean mobile UX.

## Goals / Non-Goals

**Goals:**

- Replace the template screen with a functional chat UI
- Integrate `@react-native-ai/apple` via `streamText` for progressive response display
- Check availability on launch and gate the UI appropriately
- Support light/dark mode with native-feeling chat bubbles
- Keep conversation history in memory for multi-turn chat within a session

**Non-Goals:**

- Persistent chat history (AsyncStorage / database) — session-only for v1
- Tool calling, structured outputs, embeddings, transcription, or speech
- Android AI fallback (show unsupported message only)
- Multi-user auth or cloud sync
- Message editing, deletion, or copy-to-clipboard (can add later)

## Decisions

### 1. AI SDK integration layer

**Decision:** Use Vercel AI SDK `streamText` with `apple()` provider.

```typescript
import { apple } from '@react-native-ai/apple'
import { streamText } from 'ai'

const result = streamText({
  model: apple(),
  messages: conversationHistory,
})
```

**Rationale:** The Apple provider is built for the AI SDK. Streaming is supported natively and gives the best UX. `generateText` is simpler but shows nothing until complete.

**Alternative considered:** Direct native module calls — rejected; bypasses the provider abstraction and loses streaming helpers.

### 2. Install `ai` package

**Decision:** Add `ai` (Vercel AI SDK v5) as a dependency.

**Rationale:** Required by `@react-native-ai/apple` but not currently in `package.json`.

### 3. File structure

**Decision:**

```
src/
  screens/
    ChatScreen.tsx          # Main screen — layout, availability banner
  components/
    MessageList.tsx         # FlatList of messages, auto-scroll
    MessageBubble.tsx       # User/assistant bubble styling
    ChatInput.tsx           # TextInput + send button
    TypingIndicator.tsx     # Loading dots while streaming
    UnavailableBanner.tsx   # Apple Intelligence unavailable message
  hooks/
    useChat.ts              # Message state, send, streaming logic
  types/
    chat.ts                 # Message type definitions
  theme/
    colors.ts               # Light/dark color tokens
```

**Rationale:** Flat structure appropriate for a single-feature app. Hook encapsulates AI logic; components stay presentational.

**Alternative considered:** Single-file App.tsx — rejected; too much logic in one file as features grow.

### 4. State management

**Decision:** `useChat` hook with `useState` for messages array and streaming state. No external state library.

```typescript
type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}
```

**Rationale:** Session-only chat with simple state; no need for Redux/Zustand.

### 5. Streaming UX

**Decision:** Append an empty assistant message on send, then update its `content` as `textStream` chunks arrive via `for await (const chunk of result.textStream)`.

**Rationale:** Matches standard chat-app streaming pattern. User sees tokens appear in the assistant bubble.

### 6. Availability check

**Decision:** Call `apple.isAvailable()` on mount in `useChat` or `ChatScreen`. Expose `isAvailable` boolean to disable input and show banner.

**Rationale:** Provider exposes this API specifically for gating. Avoids cryptic errors on unsupported devices.

**Platform check:** Use `Platform.OS === 'ios'` before calling; on Android, set `isAvailable = false` without calling native module.

### 7. UI design

**Decision:** iMessage-style bubbles — user messages right-aligned (blue/system tint), assistant left-aligned (gray). `KeyboardAvoidingView` + `SafeAreaView` for layout. `FlatList` inverted or with `scrollToEnd` on new messages.

**Color tokens (adapt to system):**

| Element | Light | Dark |
|---------|-------|------|
| Background | `#F2F2F7` | `#000000` |
| User bubble | `#007AFF` | `#0A84FF` |
| Assistant bubble | `#E5E5EA` | `#1C1C1E` |
| User text | `#FFFFFF` | `#FFFFFF` |
| Assistant text | `#000000` | `#FFFFFF` |

**Rationale:** Familiar chat UX. Uses iOS system colors for native feel.

### 8. App entry

**Decision:** Replace `AppContent` in `App.tsx` with `<ChatScreen />`. Remove `NewAppScreen` import.

**Rationale:** Minimal change to entry point; keeps SafeAreaProvider wrapper.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Requires iOS 26+ simulator/device — hard to test on older hardware | Document in README; test on compatible simulator; graceful unavailable UI |
| `ai` package version mismatch with provider | Pin compatible versions per provider README (AI SDK v5) |
| New Architecture required | Verify project has New Architecture enabled; document if manual step needed |
| Streaming may stutter on long responses | Acceptable for v1; FlatList re-render is fine for typical chat lengths |
| No persistence — messages lost on app close | Explicit non-goal; note in empty state or README |

## Migration Plan

1. Install `ai` package
2. Add `src/` files
3. Update `App.tsx` to render `ChatScreen`
4. Run `pod install` if needed (native dep already linked)
5. Build and run on iOS 26+ simulator/device
6. No rollback complexity — revert commit restores template

## Open Questions

- Is React Native New Architecture already enabled in this project? Verify `newArchEnabled` in gradle/Podfile before implementation.
- Should we add a system prompt (e.g., "You are a helpful assistant")? Recommend yes — single line in `streamText` call.
