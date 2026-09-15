# AI Training Coach

A React Native martial-arts training app. The phone camera watches a technique, the app records the session, and later versions add coaching — first from a cloud LLM, then from on-device pose estimation, then from realtime voice.

This repo is a **bare React Native 0.86** app (New Architecture). It is not Expo. Camera work uses Vision Camera, not Expo Camera.

## Product loop

1. Open the app and pick a technique (front kick, roundhouse, punch).
2. Start a session. The front camera shows the athlete.
3. Count repetitions (manually in V1; automatically from pose in V3+).
4. Save the session. Progress and history update immediately.
5. Later versions turn the same session payload into coaching, then into live cues.

## Version matrix

| Version | What ships | AI | Persistence |
|---|---|---|---|
| [V1 — Mobile experience](versions/v1-mobile-experience.md) | Training / Progress / History, camera preview, tap-to-count | None | Local SQLite |
| [V2 — Cloud AI](versions/v2-cloud-ai.md) | Post-session training summary | Cloud LLM | SQLite + Node/MongoDB |
| [V3 — Computer vision](versions/v3-computer-vision.md) | Pose landmarks, joint angles, real metrics | On-device pose | Same as V2 |
| [V4 — On-device AI](versions/v4-on-device-ai.md) | ONNX Runtime for latency-sensitive CV | On-device CV + cloud LLM | Same as V2 |
| [V5 — Voice coach](versions/v5-voice-coach.md) | Hands-free start / live spoken cues | Realtime speech + LLM | Same as V2 |

## Architecture evolution

```
V1                          V2                         V3 / V4                    V5
────────                    ────────                   ────────                   ────────
Camera preview              Camera preview             Camera frames              Microphone
     │                           │                          │                          │
     ▼                           ▼                          ▼                          ▼
Tap-to-count                SQLite session             Pose / ONNX                Realtime voice
     │                           │                          │                          │
     ▼                           ▼                          ▼                          ▼
Redux + SQLite              Node + MongoDB             Movement metrics           Spoken cues
                                 │                          │                          │
                                 ▼                          └──────────┬───────────────┘
                            Cloud LLM                                  ▼
                            coaching copy                         Training UI
```

Interview talking point from V4 onward: latency-sensitive computer-vision inference runs on-device; higher-level reasoning stays in a cloud LLM.

## Stable session payload

Every version reads and writes this shape. V1 stores `null` for metrics. Later versions fill them in.

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

`exercise` slugs: `front_kick`, `roundhouse_kick`, `punch`.

## Locked stack (all versions)

- React Native 0.86 (bare) + TypeScript
- React Navigation (tabs + native stacks)
- Redux Toolkit
- SQLite via `@op-engineering/op-sqlite` (local source of truth)
- `react-native-vision-camera` for camera

**Not in V1:** MongoDB, LLM calls, pose models, voice.

MongoDB is the V2+ cloud store. The Node API is the sync + LLM gateway. See [V2](versions/v2-cloud-ai.md).

## How to read these docs

Start with [V1](versions/v1-mobile-experience.md) if you are implementing now. Later files describe only what each version **adds** on top of the previous one — they do not redo the mobile shell.
