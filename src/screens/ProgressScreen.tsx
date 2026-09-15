import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { ProgressBar } from '../components/ProgressBar';
import { selectProgress } from '../features/history/progress';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatDate } from '../utils/format';

export function ProgressScreen() {
  const progress = useAppSelector(selectProgress);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}>
      <Text style={styles.title}>Progress</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{progress.totalSessions}</Text>
          <Text style={styles.statLabel}>sessions</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{progress.totalReps}</Text>
          <Text style={styles.statLabel}>total reps</Text>
        </View>
      </View>
      {progress.lastSessionAt != null ? (
        <Text style={styles.last}>
          Last session {formatDate(progress.lastSessionAt)}
        </Text>
      ) : (
        <Text style={styles.last}>No sessions yet. Start from Training.</Text>
      )}
      <Text style={styles.section}>By technique</Text>
      {progress.byExercise.map(item => (
        <View key={item.id} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.rowName}>{item.name}</Text>
            <Text style={styles.rowMeta}>
              {item.repetitions} reps · {item.sessionCount} sessions
            </Text>
          </View>
          <ProgressBar progress={item.repetitions / progress.maxReps} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  statValue: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.muted,
    marginTop: 4,
    fontWeight: '600',
  },
  last: {
    color: colors.muted,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  section: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    marginBottom: spacing.lg,
    gap: 8,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: spacing.md,
  },
  rowName: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  rowMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
});
