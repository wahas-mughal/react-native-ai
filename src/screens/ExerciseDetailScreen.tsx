import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { useAppSelector } from '../app/hooks';
import type { TrainingStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<TrainingStackParamList, 'ExerciseDetail'>;

export function ExerciseDetailScreen({ navigation, route }: Props) {
  const exercise = useAppSelector(state =>
    state.exercises.items.find(item => item.slug === route.params.slug),
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: exercise?.name ?? 'Technique' });
  }, [exercise?.name, navigation]);

  if (exercise == null) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>That technique is not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.meta}>
          Suggested set: {exercise.defaultTargetReps} reps
        </Text>
        <Text style={styles.section}>Cues</Text>
        {exercise.cues.map(cue => (
          <View key={cue} style={styles.cue}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.cueText}>{cue}</Text>
          </View>
        ))}
      </ScrollView>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={() => navigation.navigate('Session', { slug: exercise.slug })}>
        <Text style={styles.ctaLabel}>Start session</Text>
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
    paddingBottom: 120,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  meta: {
    ...typography.body,
    color: colors.muted,
    marginTop: spacing.sm,
  },
  section: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  cue: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  bullet: {
    color: colors.accent,
    fontSize: 16,
    lineHeight: 22,
  },
  cueText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  cta: {
    margin: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaLabel: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '800',
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  missingText: {
    color: colors.muted,
  },
});
