## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Actionable error messages

The system SHALL display error messages that help the user understand what went wrong and what to try next.

#### Scenario: Simulator environment error

- **WHEN** generation fails with a Foundation Models environment error
- **THEN** the error message mentions checking Apple Intelligence on the Mac and version alignment
- **AND** the user can dismiss the error by sending a new message after fixing setup
