import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';
import { SessionScreen } from '../screens/SessionScreen';
import { SessionSummaryScreen } from '../screens/SessionSummaryScreen';
import { TrainingHomeScreen } from '../screens/TrainingHomeScreen';
import { colors } from '../theme/colors';
import type { TrainingStackParamList } from './types';

const Stack = createNativeStackNavigator<TrainingStackParamList>();

export function TrainingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.accent,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen
        name="TrainingHome"
        component={TrainingHomeScreen}
        options={{ title: 'Training' }}
      />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{ title: 'Technique' }}
      />
      <Stack.Screen
        name="Session"
        component={SessionScreen}
        options={{ title: 'Session', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="SessionSummary"
        component={SessionSummaryScreen}
        options={{ title: 'Summary', headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
}
