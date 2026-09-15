import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProgressScreen } from '../screens/ProgressScreen';
import { colors } from '../theme/colors';
import { HistoryStack } from './HistoryStack';
import { TrainingStack } from './TrainingStack';
import type { RootTabParamList } from './types';

const Tabs = createBottomTabNavigator<RootTabParamList>();

export function RootTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          paddingBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="TrainingTab"
        component={TrainingStack}
        options={{ title: 'Training' }}
      />
      <Tabs.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{
          title: 'Progress',
          headerShown: true,
          headerTintColor: colors.accent,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
        }}
      />
      <Tabs.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{ title: 'History' }}
      />
    </Tabs.Navigator>
  );
}
