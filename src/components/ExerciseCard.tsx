import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { Exercise } from '../types/exercise';

type Props = {
  exercise: Exercise;
  onPress: () => void;
};

export function ExerciseCard({ exercise, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.copy}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.meta}>
          Target {exercise.defaultTargetReps} reps
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.85,
  },
  copy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  name: {
    ...typography.heading,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 4,
  },
  chevron: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '300',
  },
});
