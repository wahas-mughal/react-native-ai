# Version 4 — On-device AI

Goal: run latency-sensitive computer-vision inference on device with ONNX Runtime, while higher-level coaching stays in the V2 cloud LLM.

Extends [V3](v3-computer-vision.md).

## In scope

- ONNX Runtime Mobile (iOS + Android) for pose (and later technique classifiers)
- A stable `PoseEngine` interface so MediaPipe and ONNX are interchangeable
- Keep frame processing on device; still no video upload
- Document and measure inference latency (target: real-time overlay, not post-hoc)

## Out of scope

- Replacing the cloud LLM for training summaries
- Voice
- Training custom models from scratch (start with a public pose ONNX, then optionally a small classifier)

## Architecture

```
             React Native
                  │
        ┌─────────┴─────────┐
        │                   │
     Camera             User Input
        │                   │
        ▼                   ▼
 MediaPipe /           Cloud LLM
 ONNX Runtime               │
        │                   │
        ▼                   ▼
 Movement Metrics      AI Coaching
        │                   │
        └─────────┬─────────┘
                  ▼
             Training UI
```

Talking point: *latency-sensitive computer-vision inference happens on-device; higher-level reasoning is handled by a cloud LLM.*

## PoseEngine contract

```ts
type LandmarkMap = Record<string, { x: number; y: number; z?: number }>;

interface PoseEngine {
  name: 'mediapipe' | 'onnx';
  start(): Promise<void>;
  stop(): Promise<void>;
  infer(frame: Frame): Promise<LandmarkMap | null>;
}
```

V3 analysis (`angles`, `scoreSession`) consumes `LandmarkMap` only. It must not import ONNX or MediaPipe directly.

## Data contract

Unchanged from V3. Session payload and coaching schema stay stable. V4 is a runtime swap plus performance work.

Optional additive telemetry (local or API):

```json
{
  "engine": "onnx",
  "avgInferenceMs": 18,
  "droppedFrames": 4
}
```

## Screens that change

- Session overlay should feel smoother; no new primary screens
- Optional debug HUD (dev only): engine name + ms/frame

## Stack additions

- ONNX Runtime React Native bindings
- Packaged `.onnx` pose model in the app bundle
- Feature flag: `POSE_ENGINE=mediapipe|onnx`

## What V5 will reuse

- On-device metrics produced every frame / every rep
- Cloud coaching after the set
- Session UI that can accept a second input channel (voice) without changing the metric pipeline
