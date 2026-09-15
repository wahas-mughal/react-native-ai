import type { NavigatorScreenParams } from '@react-navigation/native';
import type { ExerciseSlug } from '../types/exercise';

export type TrainingStackParamList = {
  TrainingHome: undefined;
  ExerciseDetail: { slug: ExerciseSlug };
  Session: { slug: ExerciseSlug };
  SessionSummary: undefined;
};

export type HistoryStackParamList = {
  HistoryList: undefined;
  SessionDetail: { sessionId: string };
};

export type RootTabParamList = {
  TrainingTab: NavigatorScreenParams<TrainingStackParamList>;
  ProgressTab: undefined;
  HistoryTab: NavigatorScreenParams<HistoryStackParamList>;
};
