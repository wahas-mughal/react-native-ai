import {
  buildSession,
  mapSessionRow,
  toSessionPayload,
} from '../src/db/sessionMapper';

describe('sessionMapper', () => {
  it('builds a V1 session with null metrics and maps the stable payload', () => {
    const session = buildSession(
      {
        exerciseSlug: 'roundhouse_kick',
        startedAt: 0,
        endedAt: 42_000,
        repetitions: 15,
      },
      'ses_1',
      42_000,
    );

    expect(session.durationMs).toBe(42_000);
    expect(toSessionPayload(session)).toEqual({
      exercise: 'roundhouse_kick',
      repetitions: 15,
      durationMs: 42_000,
      accuracy: null,
      balance: null,
      speed: null,
    });
  });

  it('maps a SQLite row onto a Session', () => {
    const session = mapSessionRow({
      id: 'ses_2',
      exerciseSlug: 'punch',
      startedAt: 10,
      endedAt: 110,
      repetitions: 20,
      durationMs: 100,
      accuracy: null,
      balance: 71,
      speed: null,
      createdAt: 110,
    });

    expect(session.exerciseSlug).toBe('punch');
    expect(session.balance).toBe(71);
    expect(session.accuracy).toBeNull();
    expect(toSessionPayload(session).balance).toBe(71);
  });
});
