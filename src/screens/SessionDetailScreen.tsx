import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '../app/hooks';
import { MetricRow } from '../components/MetricRow';
import { getExerciseBySlug } from '../data/exercises';
import { toSessionPayload } from '../db/sessionMapper';
import type { HistoryStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatDate, formatDuration } from '../utils/format';

type Props = NativeStackScreenProps<HistoryStackParamList, 'SessionDetail'>;

function formatMetric(value: number | null): string {
  return value == null ? '—' : `${value}`;
}

export function SessionDetailScreen({ route }: Props) {
  const session = useAppSelector(state =>
    state.history.sessions.find(item => item.id === route.params.sessionId),
  );

  if (session == null) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Session not found.</Text>
      </View>
    );
  }

  const exercise = getExerciseBySlug(session.exerciseSlug);
  const payload = toSessionPayload(session);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{exercise?.name ?? session.exerciseSlug}</Text>
      <Text style={styles.date}>{formatDate(session.createdAt)}</Text>
      <View style={styles.card}>
        <MetricRow label="Exercise" value={payload.exercise} />
        <MetricRow label="Repetitions" value={`${payload.repetitions}`} />
        <MetricRow
          label="Duration"
          value={formatDuration(payload.durationMs)}
        />
        <MetricRow label="Accuracy" value={formatMetric(payload.accuracy)} />
        <MetricRow label="Balance" value={formatMetric(payload.balance)} />
        <MetricRow label="Speed" value={formatMetric(payload.speed)} />
      </View>
      <Text style={styles.note}>
        Metrics stay empty until computer vision lands in Version 3.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  date: {
    color: colors.muted,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  note: {
    color: colors.muted,
    marginTop: spacing.lg,
    lineHeight: 22,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    color: colors.muted,
  },
});
