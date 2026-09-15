import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { MetricRow } from '../components/MetricRow';
import { saveCompletedSession } from '../features/history/historySlice';
import { resetSession } from '../features/session/sessionSlice';
import { getExerciseBySlug } from '../data/exercises';
import type { TrainingStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatDuration } from '../utils/format';
import { buildSession, toSessionPayload } from '../db/sessionMapper';

type Props = NativeStackScreenProps<TrainingStackParamList, 'SessionSummary'>;

function formatMetric(value: number | null): string {
  return value == null ? '—' : `${value}`;
}

export function SessionSummaryScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const session = useAppSelector(state => state.activeSession);
  const saving = useAppSelector(state => state.history.saving);
  const exercise = session.exerciseSlug
    ? getExerciseBySlug(session.exerciseSlug)
    : undefined;

  const durationMs =
    session.startedAt != null && session.endedAt != null
      ? Math.max(0, session.endedAt - session.startedAt)
      : 0;

  const previewPayload =
    session.exerciseSlug != null &&
    session.startedAt != null &&
    session.endedAt != null
      ? toSessionPayload(
          buildSession(
            {
              exerciseSlug: session.exerciseSlug,
              startedAt: session.startedAt,
              endedAt: session.endedAt,
              repetitions: session.repetitions,
            },
            'preview',
            session.endedAt,
          ),
        )
      : null;

  const onSave = async () => {
    if (
      session.exerciseSlug == null ||
      session.startedAt == null ||
      session.endedAt == null
    ) {
      Alert.alert('Missing session', 'Start a new session from Training.');
      navigation.popToTop();
      return;
    }

    try {
      await dispatch(
        saveCompletedSession({
          exerciseSlug: session.exerciseSlug,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
          repetitions: session.repetitions,
        }),
      ).unwrap();
      dispatch(resetSession());
      navigation.popToTop();
    } catch (error) {
      Alert.alert(
        'Could not save',
        error instanceof Error ? error.message : 'Try again.',
      );
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>Session complete</Text>
        <Text style={styles.title}>{exercise?.name ?? 'Training'}</Text>
        <View style={styles.card}>
          <MetricRow label="Repetitions" value={`${session.repetitions}`} />
          <MetricRow label="Duration" value={formatDuration(durationMs)} />
          <MetricRow
            label="Accuracy"
            value={formatMetric(previewPayload?.accuracy ?? null)}
          />
          <MetricRow
            label="Balance"
            value={formatMetric(previewPayload?.balance ?? null)}
          />
          <MetricRow
            label="Speed"
            value={formatMetric(previewPayload?.speed ?? null)}
          />
        </View>
        <Text style={styles.note}>
          AI coaching arrives in Version 2. This session is stored locally with
          empty metrics so later versions can fill them in.
        </Text>
      </ScrollView>
      <Pressable
        accessibilityRole="button"
        disabled={saving}
        style={({ pressed }) => [
          styles.cta,
          pressed && styles.pressed,
          saving && styles.disabled,
        ]}
        onPress={onSave}>
        <Text style={styles.ctaLabel}>{saving ? 'Saving…' : 'Save session'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  kicker: {
    color: colors.accent,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    ...typography.title,
    color: colors.text,
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
    fontSize: 15,
  },
  cta: {
    margin: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaLabel: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
});
