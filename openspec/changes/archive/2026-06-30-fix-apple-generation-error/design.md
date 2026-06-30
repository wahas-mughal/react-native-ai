## Context

The chat app builds and runs, but every message triggers `FoundationModels.LanguageModelSession.GenerationError error -1`. Investigation found:

1. **SDK version mismatch**: `@react-native-ai/apple` 0.12 requires AI SDK **v6**, but the project has `ai@^7.0.8` installed
2. **Message format**: Official react-native-ai docs use `prompt` or `messages` with system as first entry — our code passes `system` as a separate `streamText` param which may not map correctly to Apple's native `Transcript.Instructions`
3. **Error surfacing**: AI SDK logs to `console.error` via `onError`, triggering red LogBox even when we handle the error
4. **Environment factor**: Error -1 can also indicate simulator/Mac Apple Intelligence asset issues — code fixes alone may not resolve on misconfigured simulators

## Goals / Non-Goals

**Goals:**

- Fix SDK compatibility (pin `ai` to v6)
- Align message format with Apple provider expectations
- Add `generateText` fallback when streaming fails
- Handle errors in UI with typed `AppleLLMErrorCodes` messages
- Suppress LogBox for handled stream errors
- Document simulator troubleshooting in README

**Non-Goals:**

- Fixing Apple's simulator asset downloads (user environment)
- Switching to a different AI provider
- Persisting chat history

## Decisions

### 1. Pin AI SDK to v6

**Decision:** `npm install ai@^6`

**Rationale:** `@react-native-ai/apple` 0.12 explicitly targets AI SDK v6 (V3 provider spec). v7 is unsupported and likely causes generation failures.

**Alternative:** Downgrade apple provider to 0.11 for AI SDK v5 — rejected; we already have 0.12 installed.

### 2. Message format for Apple native layer

**Decision:** Build messages array explicitly:

```typescript
const modelMessages = [
  { role: 'system', content: SYSTEM_PROMPT },
  ...conversationHistory,
  { role: 'user', content: trimmed },
];

streamText({
  model: apple(),
  messages: modelMessages,
});
```

Remove separate `system` param — Apple's `createTranscriptAndPrompt` expects system role in messages array as `Transcript.Instructions`.

**Rationale:** Native Swift code maps `role: "system"` to instructions; separate AI SDK `system` param may not translate correctly through the provider.

### 3. Streaming with fullStream + fallback

**Decision:**

1. Primary: `streamText` with `fullStream` loop (handle `text-delta` and `error` parts)
2. Fallback: on stream failure, call `generateText` with same messages
3. Capture errors via `onError` AND `fullStream` error parts

**Rationale:** Docs recommend `fullStream` for error inspection; fallback covers streaming-specific failures.

### 4. Suppress LogBox for handled errors

**Decision:** Wrap `onError` to set state without `console.error`. Optionally use `LogBox.ignoreLogs` for known FoundationModels error pattern.

```typescript
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'FoundationModels.LanguageModelSession.GenerationError',
]);
```

**Rationale:** AI SDK's default `onError` calls `console.error`, which triggers dev overlay even when we handle the error.

### 5. Error message mapping

**Decision:** Map `AppleLLMErrorCodes` and error -1 to user-friendly strings in `formatGenerationError()`.

| Error | User message |
|-------|-------------|
| GenerationError -1 | Check Mac Apple Intelligence, version alignment |
| MODEL_UNAVAILABLE | Apple Intelligence not available on this device |
| CONTEXT_WINDOW_EXCEEDED | Conversation too long, start a new chat |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Error -1 persists after SDK fix (simulator env) | README troubleshooting; test on physical iOS 26+ device |
| AI SDK v6 API differs from v7 | Pin exact version, run TypeScript check |
| generateText fallback slower UX | Only used when streaming fails |
| LogBox.ignoreLogs hides useful dev info | Only ignore specific FoundationModels pattern |

## Migration Plan

1. `npm install ai@^6`
2. Refactor `useChat.ts`
3. Add LogBox ignore in `index.js` or `App.tsx`
4. Update README with Apple Intelligence simulator requirements
5. Clear Metro cache and rebuild iOS
6. Test on iPhone 17 Pro simulator

## Open Questions

- Does pinning to ai@6 alone fix error -1, or is it purely environmental on this Mac?
- Should we add a dev-only "test generation" button that calls `generateText({ prompt: 'Hello' })` for debugging?
