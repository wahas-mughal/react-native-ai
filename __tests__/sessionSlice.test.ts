import {
  endSession,
  incrementRep,
  initialActiveSessionState,
  resetSession,
  sessionReducer,
  startSession,
} from '../src/features/session/sessionSlice';

describe('sessionReducer', () => {
  it('starts a session and increments reps while running', () => {
    let state = sessionReducer(
      initialActiveSessionState,
      startSession({ exerciseSlug: 'front_kick', startedAt: 1_000 }),
    );

    expect(state.status).toBe('running');
    expect(state.exerciseSlug).toBe('front_kick');
    expect(state.repetitions).toBe(0);

    state = sessionReducer(state, incrementRep());
    state = sessionReducer(state, incrementRep());
    expect(state.repetitions).toBe(2);
  });

  it('ends a session with duration timestamps and ignores later reps', () => {
    let state = sessionReducer(
      initialActiveSessionState,
      startSession({ exerciseSlug: 'roundhouse_kick', startedAt: 1_000 }),
    );
    state = sessionReducer(state, incrementRep());
    state = sessionReducer(state, endSession({ endedAt: 5_000 }));

    expect(state.status).toBe('ended');
    expect(state.endedAt).toBe(5_000);
    expect(state.repetitions).toBe(1);

    const afterEnd = sessionReducer(state, incrementRep());
    expect(afterEnd.repetitions).toBe(1);
  });

  it('resets back to idle', () => {
    let state = sessionReducer(
      initialActiveSessionState,
      startSession({ exerciseSlug: 'punch', startedAt: 1 }),
    );
    state = sessionReducer(state, resetSession());
    expect(state).toEqual(initialActiveSessionState);
  });
});
