jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: ({ children, ...props }) =>
      React.createElement(View, props, children),
    GestureDetector: ({ children }) => children,
    Gesture: {
      Pan: () => ({ onUpdate: () => ({}) }),
      Tap: () => ({ onEnd: () => ({}) }),
      Native: () => ({}),
    },
    State: {},
    Directions: {},
  };
});

jest.mock('react-native-screens', () => {
  const RN = require('react-native');
  return {
    enableScreens: jest.fn(),
    screensEnabled: () => true,
    Screen: RN.View,
    ScreenContainer: RN.View,
    NativeScreen: RN.View,
    NativeScreenContainer: RN.View,
    FullWindowOverlay: RN.View,
  };
});

jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Camera: props => React.createElement(View, props),
    useCameraDevice: () => undefined,
    useCameraPermission: () => ({
      hasPermission: false,
      requestPermission: jest.fn(async () => false),
      canRequestPermission: false,
      status: 'denied',
    }),
  };
});

jest.mock('react-native-nitro-modules', () => ({
  NitroModules: { createHybridObject: jest.fn() },
  callback: fn => fn,
}));

jest.mock('@op-engineering/op-sqlite', () => ({
  open: () => ({
    execute: jest.fn(async () => ({ rows: [], rowsAffected: 0 })),
    executeSync: jest.fn(() => ({ rows: [], rowsAffected: 0 })),
    executeBatch: jest.fn(async () => ({ rowsAffected: 0 })),
  }),
}));
