# chat-ui

## Purpose

Chat screen layout — message bubbles, input bar, keyboard handling, and visual states.

## Requirements

### Requirement: Chat message list

The system SHALL display a scrollable list of chat messages with distinct styling for user and assistant roles.

#### Scenario: User message display

- **WHEN** the user sends a message
- **THEN** the message appears as a right-aligned bubble with user styling
- **AND** the list scrolls to show the latest message

#### Scenario: Assistant message display

- **WHEN** the assistant responds
- **THEN** the message appears as a left-aligned bubble with assistant styling
- **AND** the list scrolls to show the latest message

#### Scenario: Empty chat state

- **WHEN** no messages have been sent yet
- **THEN** the system displays a welcome or empty-state message prompting the user to start a conversation

### Requirement: Message input bar

The system SHALL provide a text input field and send button fixed at the bottom of the screen.

#### Scenario: Type and send

- **WHEN** the user types text in the input field
- **THEN** the send button becomes enabled (when text is non-empty and AI is available)
- **WHEN** the user taps send or presses return
- **THEN** the input field clears
- **AND** the message is sent to the AI layer

#### Scenario: Empty input

- **WHEN** the input field is empty
- **THEN** the send button is disabled

#### Scenario: Keyboard handling

- **WHEN** the keyboard opens
- **THEN** the input bar remains visible above the keyboard
- **AND** the message list adjusts so the latest messages stay in view

### Requirement: Loading and status indicators

The system SHALL provide clear visual feedback during AI generation and for handled errors.

#### Scenario: Assistant typing indicator

- **WHEN** the assistant is generating a response
- **THEN** a typing or loading indicator is shown in the message area
- **AND** the input send button is disabled

#### Scenario: Unavailable state

- **WHEN** Apple Intelligence is not available
- **THEN** a banner or inline message explains why chat is disabled
- **AND** the input bar appears visually disabled

#### Scenario: Handled generation error

- **WHEN** a generation error is caught and handled by the chat hook
- **THEN** an inline error message is shown above the input bar
- **AND** no red React Native LogBox overlay appears for the handled error

### Requirement: Clean mobile UX

The system SHALL follow platform-native chat conventions for a polished experience.

#### Scenario: Safe area and status bar

- **WHEN** the chat screen renders
- **THEN** content respects safe area insets (notch, home indicator)
- **AND** the status bar style adapts to light/dark mode

#### Scenario: Dark mode support

- **WHEN** the device is in dark mode
- **THEN** message bubbles, background, and input bar use appropriate dark-theme colors
- **WHEN** the device is in light mode
- **THEN** the UI uses light-theme colors

#### Scenario: Readable message text

- **WHEN** messages are displayed
- **THEN** text is legible with sufficient contrast against bubble backgrounds
- **AND** long messages wrap within the bubble without horizontal overflow

### Requirement: Actionable error messages

The system SHALL display error messages that help the user understand what went wrong and what to try next.

#### Scenario: Simulator environment error

- **WHEN** generation fails with a Foundation Models environment error
- **THEN** the error message mentions checking Apple Intelligence on the Mac and version alignment
- **AND** the user can dismiss the error by sending a new message after fixing setup
