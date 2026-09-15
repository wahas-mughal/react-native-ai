module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  watchman: false,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@reduxjs|immer|react-redux|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-vision-camera|@op-engineering)/)',
  ],
};
