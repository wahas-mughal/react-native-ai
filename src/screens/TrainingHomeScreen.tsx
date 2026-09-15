import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '../app/hooks';
import { ExerciseCard } from '../components/ExerciseCard';
import type { TrainingStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<TrainingStackParamList, 'TrainingHome'>;

export function TrainingHomeScreen({ navigation }: Props) {
  const exercises = useAppSelector(state => state.exercises.items);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>AI Training Coach</Text>
      <Text style={styles.title}>Practice a technique</Text>
      <Text style={styles.subtitle}>
        Pick a movement, train in front of the camera, and log each rep.
        Coaching arrives in Version 2.
      </Text>
      <View style={styles.list}>
        {exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onPress={() =>
              navigation.navigate('ExerciseDetail', { slug: exercise.slug })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  kicker: {
    ...typography.caption,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.muted,
    lineHeight: 22,
  },
  list: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});
