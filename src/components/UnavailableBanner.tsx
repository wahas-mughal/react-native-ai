import { Platform, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { getChatColors } from '../theme/colors';

export function UnavailableBanner() {
  const colors = getChatColors(useColorScheme() === 'dark' ? 'dark' : 'light');
  const message =
    Platform.OS === 'android'
      ? 'Apple Intelligence chat is only available on iOS.'
      : 'Apple Intelligence is not available on this device. Requires iOS 26+ and an Apple Intelligence-enabled device.';

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.bannerBackground,
        },
      ]}>
      <Text style={[styles.text, { color: colors.bannerText }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
