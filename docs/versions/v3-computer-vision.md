# Version 3 — Computer vision

Goal: turn the camera stream into body landmarks and movement metrics. Stop treating accuracy / balance / speed as null. Do **not** upload video; process frames on device.

Extends [V2](v2-cloud-ai.md).

## In scope

- Pose estimation on the live camera stream (MediaPipe Pose or equivalent)
- Landmarks for shoulder, hip, knee, ankle (and elbow for punch)
- Derived angles: `kneeAngle`, `hipRotation`, `torsoAngle`
- Per-rep scoring → session-level `accuracy`, `balance`, `speed`
- Optional auto-count when a rep pattern is detected (keep manual **Rep** as override)
- Overlay skeleton on the camera preview

## Out of scope

- ONNX Runtime swap (that is V4)
- Voice
- Sending raw video to the server

## Architecture

```
Camera
  → Video frames
  → Pose detection
  → Landmarks { x, y [, z] }
  → Movement analysis
  → Training metrics
  → SQLite session + V2 coaching API
```

```
Shoulder ●
        |
     Hip ●
        / \
       ●   ●
     Knee Knee
```

## Data contract

Landmark frame (example):

```json
{
  "t": 1234567890,
  "landmarks": {
    "leftShoulder": { "x": 0.42, "y": 0.31 },
    "rightShoulder": { "x": 0.58, "y": 0.30 },
    "leftHip": { "x": 0.44, "y": 0.55 },
    "rightHip": { "x": 0.56, "y": 0.55 },
    "leftKnee": { "x": 0.43, "y": 0.74 },
    "rightKnee": { "x": 0.57, "y": 0.72 },
    "leftAnkle": { "x": 0.43, "y": 0.91 },
    "rightAnkle": { "x": 0.58, "y": 0.90 }
  }
}
```

Per-rep analysis (kept on device; optional debug persist):

```json
{
  "repIndex": 3,
  "kneeAngle": 162,
  "hipRotation": 48,
  "torsoAngle": 12,
  "formFlags": ["knee_drop"]
}
```

Session payload after V3 — same shape as V1, metrics filled:

```json
{
  "exercise": "roundhouse_kick",
  "repetitions": 15,
  "durationMs": 42000,
  "accuracy": 78,
  "balance": 71,
  "speed": 83
}
```

Scores are 0–100 integers. V2’s coaching endpoint already accepts these fields.

## Technique rules (first pass)

| Exercise | Signals |
|---|---|
| Front kick | Knee chamber height, extension angle, supporting-leg stability |
| Roundhouse | Hip rotation, supporting-leg balance, chamber → extension sequence |
| Punch | Guard (non-punching hand), shoulder–hip alignment, elbow path |

These rules are heuristics on landmarks, not an LLM. The LLM in V2 still writes the prose.

## Screens that change

- **Session**: skeleton overlay, live flags (“knee dropping”), optional auto-count
- **SessionSummary / SessionDetail**: real metric numbers instead of placeholders
- V2 coaching card becomes specific because the payload is no longer null

## Stack additions

- Vision Camera **frame processors**
- MediaPipe Pose (or a RN-friendly pose package wrapping it)
- Small analysis module: `src/vision/angles.ts`, `src/vision/scoreSession.ts`

## What V4 will reuse

- Landmark → angle → metric pipeline
- Overlay and form-flag UX
- The same session payload
- Swap the pose runtime (MediaPipe → ONNX) behind the same interface
