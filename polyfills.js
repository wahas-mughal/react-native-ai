import { Platform } from 'react-native';
import structuredClone from '@ungap/structured-clone';
import {
  TransformStream,
  ReadableStream,
  WritableStream,
} from 'web-streams-polyfill';

const { TextEncoder, TextDecoder } = require('text-encoding');

if (Platform.OS !== 'web') {
  // Official react-native-ai polyfill pattern uses RN's polyfillGlobal helper.
  // eslint-disable-next-line @react-native/no-deep-imports
  const { polyfillGlobal } = require(
    'react-native/Libraries/Utilities/PolyfillFunctions',
  );

  if (!('structuredClone' in global)) {
    polyfillGlobal('structuredClone', () => structuredClone);
  }

  if (!('TextEncoder' in global)) {
    polyfillGlobal('TextEncoder', () => TextEncoder);
  }

  if (!('TextDecoder' in global)) {
    polyfillGlobal('TextDecoder', () => TextDecoder);
  }

  if (!('TransformStream' in global)) {
    polyfillGlobal('TransformStream', () => TransformStream);
  }

  if (!('ReadableStream' in global)) {
    polyfillGlobal('ReadableStream', () => ReadableStream);
  }

  if (!('WritableStream' in global)) {
    polyfillGlobal('WritableStream', () => WritableStream);
  }

  const { TextEncoderStream, TextDecoderStream } = require(
    '@stardazed/streams-text-encoding',
  );

  polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
  polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
}

export {};
