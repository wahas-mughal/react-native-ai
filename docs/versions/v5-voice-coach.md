# Version 5 — Voice coach

Goal: train without touching the phone. Speech starts the session; spoken cues fire during the set; streaming audio talks back.

Extends [V4](v4-on-device-ai.md).

## In scope

- Microphone capture and playback
- Realtime connection (WebSockets) to a speech / LLM service
- Commands: start session, choose technique, end set
- Live cues driven by V3/V4 form flags (“Keep your guard up.”, “Good. Two more.”)
- Interruption handling, connection recovery, partial transcripts
- Latency budget: cues should feel in-set, not after the rep is over

## Out of scope

- Replacing the camera / pose pipeline
- Fully offline voice (cloud realtime is the V5 path; on-device STT can be a later experiment)

## Architecture

```
Microphone
    ↓
Realtime connection
    ↓
Speech / AI
    ↓
Streaming response
    ↓
Audio output
```

Two parallel inputs into the session:

```
Pose metrics (on-device) ──► cue planner ──► TTS / audio stream
Voice commands (cloud)   ──► session control (start / stop / next)
```

The cue planner is a small on-device rules layer plus optional short LLM turns. Pose flags should not wait on a round-trip before a basic cue (“knee dropping”) plays. Richer coaching can stream from the cloud.

## Data contract

Voice command (parsed):

```json
{
  "intent": "start_session",
  "exercise": "roundhouse_kick",
  "sets": 3,
  "reps": 10
}
```

Live cue event:

```json
{
  "sessionId": "...",
  "atMs": 8400,
  "source": "pose_flag" | "rep_count" | "llm",
  "text": "Keep your guard up."
}
```

Persist cues on the session (additive) so History can replay what was said.

## Screens that change

- Session: always-on listening indicator, last cue caption, mute
- TrainingHome: “Start with voice” entry
- Permission: microphone (in addition to camera)

## Skills this version demonstrates

- WebSockets
- Streaming audio
- Microphone capture and playback
- Interruption handling
- Connection recovery
- Partial responses
- Latency optimization

## Stack additions

- Mic permission (`NSMicrophoneUsageDescription`, `RECORD_AUDIO`)
- WebSocket client
- Speech-to-text + TTS provider (or a realtime multimodal API)
- Audio session config so cues play while the camera stays open
