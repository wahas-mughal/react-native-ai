import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { CameraPreview } from '../components/CameraPreview';
import { RepCounter } from '../components/RepCounter';
import { SessionTimer } from '../components/SessionTimer';
import {
  endSession,
  incrementRep,
  resetSession,
  startSession,
} from '../features/session/sessionSlice';
import type { TrainingStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<TrainingStackParamList, 'Session'>;

export function SessionScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const exercise = useAppSelector(state =>
    state.exercises.items.find(item => item.slug === route.params.slug),
  );
  const session = useAppSelector(state => state.activeSession);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    dispatch(
      startSession({
        exerciseSlug: route.params.slug,
        startedAt: Date.now(),
      }),
    );
  }, [dispatch, route.params.slug]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (event.data.action.type === 'REPLACE') {
        return;
      }
      dispatch(resetSession());
    });
    return unsubscribe;
  }, [dispatch, navigation]);

  const durationMs =
    session.startedAt == null ? 0 : Math.max(0, now - session.startedAt);

  const onEnd = () => {
    dispatch(endSession({ endedAt: Date.now() }));
    navigation.replace('SessionSummary');
  };

  return (
    <View style={styles.screen}>
      <CameraPreview isActive={session.status === 'running'} />
      <View style={styles.overlay}>
        <View style={styles.top}>
          <Text style={styles.exercise}>{exercise?.name ?? 'Session'}</Text>
          <Text style={styles.hint}>Tap Rep after each movement</Text>
        </View>
        <View style={styles.stats}>
          <SessionTimer durationMs={durationMs} />
          <RepCounter
            count={session.repetitions}
            target={exercise?.defaultTargetReps}
          />
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log repetition"
            style={({ pressed }) => [styles.rep, pressed && styles.pressed]}
            onPress={() => dispatch(incrementRep())}>
            <Text style={styles.repLabel}>Rep</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.end, pressed && styles.pressed]}
            onPress={onEnd}>
            <Text style={styles.endLabel}>End</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cameraFallback,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.overlay,
  },
  top: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  exercise: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  hint: {
    color: colors.muted,
    marginTop: 6,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(11, 15, 20, 0.55)',
    borderRadius: 18,
    paddingVertical: spacing.md,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  rep: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: 'center',
  },
  repLabel: {
    color: colors.background,
    fontSize: 22,
    fontWeight: '800',
  },
  end: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  endLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
