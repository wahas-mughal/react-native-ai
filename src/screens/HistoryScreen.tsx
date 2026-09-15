import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '../app/hooks';
import { getExerciseBySlug } from '../data/exercises';
import type { HistoryStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatDate, formatDuration } from '../utils/format';

type Props = NativeStackScreenProps<HistoryStackParamList, 'HistoryList'>;

export function HistoryScreen({ navigation }: Props) {
  const sessions = useAppSelector(state => state.history.sessions);

  if (sessions.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No sessions yet</Text>
        <Text style={styles.emptyBody}>
          Complete a training session and it will show up here.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {sessions.map(session => {
        const exercise = getExerciseBySlug(session.exerciseSlug);
        return (
          <Pressable
            key={session.id}
            accessibilityRole="button"
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={() =>
              navigation.navigate('SessionDetail', { sessionId: session.id })
            }>
            <Text style={styles.name}>{exercise?.name ?? session.exerciseSlug}</Text>
            <Text style={styles.meta}>
              {session.repetitions} reps · {formatDuration(session.durationMs)}
            </Text>
            <Text style={styles.date}>{formatDate(session.createdAt)}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  name: {
    ...typography.heading,
    color: colors.text,
  },
  meta: {
    color: colors.muted,
    marginTop: 6,
    fontWeight: '600',
  },
  date: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 13,
  },
  empty: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.text,
  },
  emptyBody: {
    color: colors.muted,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
});
