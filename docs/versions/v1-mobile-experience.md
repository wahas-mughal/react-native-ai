# Version 1 — Mobile experience

Goal: ship the real training product on device, with no AI. A user can pick a technique, train in front of the camera, log reps by tapping, and see progress and history persist locally.

## In scope

- Home tabs: **Training**, **Progress**, **Training History**
- Three techniques: Front Kick, Roundhouse, Punch
- Exercise detail with coaching cues (static copy)
- Session screen: front-camera preview, timer, tap-to-count reps, end session
- Session summary that saves the stable payload to SQLite
- Progress aggregates (session count, total reps, per-exercise bars)
- History list + session detail
- Camera permission denied / no-device fallback: timer + counter still work

## Out of scope

- LLM coaching, structured AI summaries
- Pose estimation, landmarks, joint angles
- Video recording or upload
- MongoDB / Node API / cloud sync
- Voice, WebSockets, microphone capture
- Accounts / auth

## Architecture

```
Training UI
    │
    ├── Vision Camera (preview only)
    ├── Redux Toolkit (exercises, activeSession, history)
    └── SQLite (source of truth)
```

Writes go **repository → SQLite → Redux slice** so Progress and History stay consistent after a save.

## Navigation

```
RootTabs
  TrainingStack
    TrainingHome
    ExerciseDetail
    Session
    SessionSummary
  Progress
  HistoryStack
    HistoryList
    SessionDetail
```

## Data contract

### Exercises (seeded)

| slug | name | defaultTargetReps |
|---|---|---|
| `front_kick` | Front Kick | 10 |
| `roundhouse_kick` | Roundhouse | 10 |
| `punch` | Punch | 20 |

Each exercise has a `cues` array of short coaching strings shown on the detail screen.

### Sessions

```ts
type Session = {
  id: string;
  exerciseSlug: 'front_kick' | 'roundhouse_kick' | 'punch';
  startedAt: number;
  endedAt: number;
  repetitions: number;
  durationMs: number;
  accuracy: number | null;
  balance: number | null;
  speed: number | null;
  createdAt: number;
};
```

V1 always writes `accuracy`, `balance`, and `speed` as `null`. That is intentional: V2+ fill these fields without a schema change.

### SQLite tables

```sql
exercises (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cues TEXT NOT NULL,          -- JSON array
  defaultTargetReps INTEGER NOT NULL
)

sessions (
  id TEXT PRIMARY KEY,
  exerciseSlug TEXT NOT NULL,
  startedAt INTEGER NOT NULL,
  endedAt INTEGER NOT NULL,
  repetitions INTEGER NOT NULL,
  durationMs INTEGER NOT NULL,
  accuracy REAL,
  balance REAL,
  speed REAL,
  createdAt INTEGER NOT NULL
)
```

## Screens

| Screen | Behavior |
|---|---|
| TrainingHome | Cards for the three techniques |
| ExerciseDetail | Name, cues, default target, **Start session** |
| Session | Front camera overlay + timer + large **Rep** control + **End** |
| SessionSummary | Reps, duration, null metrics, note that coaching arrives in V2, **Save** |
| Progress | Totals + per-exercise rep bars |
| HistoryList | Newest sessions first |
| SessionDetail | Full session row |

## Session UX

1. Pick technique → Start session
2. Front camera preview with overlay (name, timer, reps)
3. **Rep** increments count
4. **End** → summary → persist
5. Placeholder copy: *AI coaching arrives in Version 2*

Simulator camera is weak. V1 camera is designed for a **physical device**. The session must still complete without a preview.

## Stack

- React Native 0.86 + TypeScript (existing app)
- React Navigation (tabs + native stacks)
- Redux Toolkit + react-redux
- `@op-engineering/op-sqlite`
- `react-native-vision-camera` v5 (preview only; no frame processors). Peers: `react-native-nitro-modules`, `react-native-nitro-image`.

## What V2 will reuse

- Navigation shell and screens
- Session payload and SQLite schema
- Camera session flow (preview stays; analysis is added later)
- Progress / History as consumers of sessions
