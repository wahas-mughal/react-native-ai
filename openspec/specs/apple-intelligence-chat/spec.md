# apple-intelligence-chat

## Purpose

On-device chat powered by Apple Foundation Models via `@react-native-ai/apple`.

## Requirements

### Requirement: Apple Intelligence availability check

The system SHALL check whether Apple Intelligence is available on the device before attempting to generate responses, using `apple.isAvailable()` from `@react-native-ai/apple`.

#### Scenario: Apple Intelligence available

- **WHEN** the app launches on an iOS 26+ device with Apple Intelligence enabled
- **THEN** the chat input is enabled and the user can send messages

#### Scenario: Apple Intelligence unavailable

- **WHEN** the app launches on a device where Apple Intelligence is not available
- **THEN** the system displays a clear message explaining the requirement (iOS 26+, Apple Intelligence enabled device)
- **AND** the chat input is disabled

#### Scenario: Android platform

- **WHEN** the app runs on Android
- **THEN** the system displays a message that Apple Intelligence chat is iOS-only
- **AND** the chat input is disabled

### Requirement: Send user message and receive AI response

The system SHALL send the user's message to Apple Foundation Models via `@react-native-ai/apple` and display the assistant's response in the chat.

#### Scenario: Successful message exchange

- **WHEN** the user types a message and taps send
- **THEN** the user message appears in the chat immediately
- **AND** the system calls the Apple Foundation Models native API with properly formatted messages
- **AND** the assistant response appears in the chat when generation completes

#### Scenario: Conversation context preserved

- **WHEN** the user sends multiple messages in a session
- **THEN** each new request includes prior user and assistant messages as context
- **AND** the assistant response reflects the conversation history

### Requirement: Stream assistant responses

The system SHALL stream assistant responses token-by-token so the user sees text appear progressively rather than waiting for the full response.

#### Scenario: Streaming in progress

- **WHEN** the assistant is generating a response
- **THEN** partial text appears in the assistant message bubble as tokens arrive
- **AND** a loading indicator is shown until streaming completes

#### Scenario: Streaming complete

- **WHEN** the stream finishes
- **THEN** the final assistant message is displayed in full
- **AND** the loading indicator is removed
- **AND** the send button is re-enabled

### Requirement: Error handling for AI generation

The system SHALL handle AI generation failures gracefully and inform the user without crashing the app.

#### Scenario: Generation fails

- **WHEN** Apple Intelligence returns an error during generation
- **THEN** the system displays an error message in or near the chat
- **AND** the user can retry by sending another message
- **AND** previously sent messages remain visible

#### Scenario: Send while generating

- **WHEN** the assistant is still generating a response
- **THEN** the send button is disabled
- **AND** the user cannot send a duplicate message until the current response completes

### Requirement: Typed Apple LLM error handling

The system SHALL classify generation failures and show actionable messages to the user.

#### Scenario: Generation error -1 on simulator

- **WHEN** Foundation Models returns `GenerationError error -1`
- **THEN** the system displays a user-friendly message about Apple Intelligence setup (Mac AI enabled, matching Xcode/macOS/simulator versions)
- **AND** the error is handled in-app without an unhandled dev console overlay

#### Scenario: Model unavailable

- **WHEN** `apple.isAvailable()` is false or model is unavailable at generation time
- **THEN** the system displays the unavailable banner and disables input
