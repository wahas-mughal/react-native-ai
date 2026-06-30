## MODIFIED Requirements

### Requirement: Send user message and receive AI response

The system SHALL send the user's message to Apple Foundation Models via the Vercel AI SDK using `@react-native-ai/apple` with a compatible AI SDK version (v6) and display the assistant's response in the chat.

#### Scenario: Successful message exchange

- **WHEN** the user types a message and taps send
- **THEN** the user message appears in the chat immediately
- **AND** the system calls `streamText` with `model: apple()` and messages formatted for the Apple provider (system instructions as first message in `messages` array)
- **AND** the assistant response appears in the chat when generation completes

#### Scenario: Conversation context preserved

- **WHEN** the user sends multiple messages in a session
- **THEN** each new request includes prior user and assistant messages as context
- **AND** the assistant response reflects the conversation history

#### Scenario: Streaming fallback to non-streaming

- **WHEN** `streamText` fails with a generation error
- **THEN** the system retries with `generateText` using the same messages
- **AND** the assistant response still appears in the chat if generation succeeds

## ADDED Requirements

### Requirement: AI SDK version compatibility

The system SHALL use AI SDK v6 (`ai@^6`) to match `@react-native-ai/apple` 0.12 provider requirements.

#### Scenario: Compatible SDK installed

- **WHEN** the app is built
- **THEN** `package.json` specifies `ai` at version 6.x (not 7.x)
- **AND** generation calls succeed without provider version mismatch

### Requirement: Typed Apple LLM error handling

The system SHALL use `AppleLLMErrorCodes` from `@react-native-ai/apple` to classify generation failures and show actionable messages.

#### Scenario: Generation error -1 on simulator

- **WHEN** Foundation Models returns `GenerationError error -1`
- **THEN** the system displays a user-friendly message about Apple Intelligence setup (Mac AI enabled, matching Xcode/macOS/simulator versions)
- **AND** the error is handled in-app without an unhandled dev console overlay

#### Scenario: Model unavailable

- **WHEN** `apple.isAvailable()` is false or model is unavailable at generation time
- **THEN** the system displays the unavailable banner and disables input
