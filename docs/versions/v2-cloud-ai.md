# Version 2 — Cloud AI

Goal: after a workout, send the V1 session payload to a cloud LLM and show a personalized training summary. Introduce a Node API + MongoDB as the cloud store. No computer vision yet.

Extends [V1](v1-mobile-experience.md).

## In scope

- Node/Express (or Fastify) API with MongoDB
- Sync completed sessions from SQLite → API
- LLM call with **structured output**: strengths, needs-improvement, next-session plan
- Session summary screen shows the generated coaching card
- Persist the coaching card locally (SQLite) and in MongoDB
- Offline: session still saves locally; coaching generates when the network returns

## Out of scope

- Pose estimation / landmarks
- ONNX Runtime
- Voice / realtime audio
- Replacing tap-to-count (still manual)

## Architecture

```
Session complete (V1 flow)
        │
        ▼
  SQLite session row
        │
        ▼
  POST /sessions  →  MongoDB
        │
        ▼
  POST /sessions/:id/coach  →  Cloud LLM
        │
        ▼
  Training Summary card  →  SQLite + MongoDB + UI
```

SQLite remains the on-device source of truth. MongoDB is the cloud copy and the place the API reads from when generating coaching.

## Data contract

Request to the LLM (same V1 payload, metrics still null unless a later version filled them):

```json
{
  "exercise": "roundhouse_kick",
  "repetitions": 15,
  "durationMs": 42000,
  "accuracy": null,
  "balance": null,
  "speed": null
}
```

When metrics are null, the prompt must still produce useful coaching from exercise + reps + duration (pacing, volume, suggested drills). When V3+ fills metrics, the same prompt uses them.

Structured LLM output:

```json
{
  "headline": "You completed 15 roundhouse kicks.",
  "strengths": ["Good speed", "Strong hip rotation"],
  "needsImprovement": ["Balance on your supporting leg", "Guard position"],
  "nextSession": [
    "3 × 10 slow kicks",
    "2 × 10 balance drills"
  ]
}
```

New SQLite / Mongo fields (additive):

```ts
type CoachingCard = {
  sessionId: string;
  headline: string;
  strengths: string[];
  needsImprovement: string[];
  nextSession: string[];
  model: string;
  createdAt: number;
};
```

## API sketch

| Method | Path | Role |
|---|---|---|
| `POST` | `/sessions` | Upsert a completed session |
| `GET` | `/sessions` | List for future multi-device (optional in V2) |
| `POST` | `/sessions/:id/coach` | Generate and store coaching |

Auth can start as a device-scoped ID stored on device. Full accounts are not required in V2.

## Screens that change

- **SessionSummary**: loading → coaching card, or a retry state if the LLM call fails
- **SessionDetail**: show the saved card
- **Progress**: optional “last coaching focus” line from the newest card

## Stack additions

- Node API + MongoDB
- Cloud LLM (OpenAI, Anthropic, or the existing Apple on-device model as an iOS-only fallback — primary path is cloud so Android works)
- Keep `src/services/appleLlm.ts` as an optional iOS path, not the V2 source of truth

## What V3 will reuse

- Coaching prompt + structured output schema
- MongoDB session documents
- Summary UI — V3 just sends real `accuracy` / `balance` / `speed` instead of null
