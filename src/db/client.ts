import { open, type DB } from '@op-engineering/op-sqlite';

let db: DB | null = null;

export function getDb(): DB {
  if (db == null) {
    db = open({ name: 'training-coach.sqlite' });
  }
  return db;
}

export function resetDbForTests(): void {
  db = null;
}
