import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { formatDuration } from '../utils/format';

type Props = {
  durationMs: number;
};

export function SessionTimer({ durationMs }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.time}>{formatDuration(durationMs)}</Text>
      <Text style={styles.label}>time</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  time: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
});
