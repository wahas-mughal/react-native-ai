import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = {
  count: number;
  target?: number;
};

export function RepCounter({ count, target }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>
        {target != null ? `reps / ${target} target` : 'reps'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  count: {
    ...typography.metric,
    color: colors.text,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
});
