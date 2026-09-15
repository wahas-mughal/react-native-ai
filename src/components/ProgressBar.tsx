import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  progress: number;
};

export function ProgressBar({ progress }: Props) {
  const width = `${Math.round(
    Math.min(1, Math.max(0, progress)) * 100,
  )}%` as `${number}%`;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 999,
  },
});
