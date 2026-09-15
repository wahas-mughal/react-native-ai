/**
 * @format
 */

import 'react-native-gesture-handler';
import './polyfills';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

LogBox.ignoreLogs([
  'FoundationModels.LanguageModelSession.GenerationError',
]);

AppRegistry.registerComponent(appName, () => App);
