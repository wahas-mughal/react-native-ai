import {
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ChatScreen() {

  return (
    <SafeAreaView
      style={[styles.safeArea]}
      edges={['top', 'left', 'right']}>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  messages: {
    flex: 1,
  },
  error: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
