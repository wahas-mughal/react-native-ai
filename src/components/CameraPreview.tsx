import { Component, type ReactNode, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { colors } from '../theme/colors';

type Props = {
  isActive: boolean;
};

function CameraFallback({ message }: { message: string }) {
  return (
    <View style={styles.fallback}>
      <Text style={styles.fallbackTitle}>Camera preview unavailable</Text>
      <Text style={styles.fallbackBody}>{message}</Text>
      <Text style={styles.fallbackHint}>
        Timer and tap-to-count still work. Use a physical device for preview.
      </Text>
    </View>
  );
}

class CameraErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function LivePreview({ isActive }: Props) {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission, canRequestPermission } =
    useCameraPermission();

  useEffect(() => {
    if (!hasPermission && canRequestPermission) {
      requestPermission().catch(() => undefined);
    }
  }, [canRequestPermission, hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <CameraFallback message="Camera permission is off. You can still log this session manually." />
    );
  }

  if (device == null) {
    return (
      <CameraFallback message="No front camera was found on this device or simulator." />
    );
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isActive}
      onError={() => undefined}
    />
  );
}

export function CameraPreview({ isActive }: Props) {
  return (
    <CameraErrorBoundary
      fallback={
        <CameraFallback message="The camera module could not start on this device." />
      }>
      <LivePreview isActive={isActive} />
    </CameraErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fallback: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.cameraFallback,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  fallbackTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  fallbackBody: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  fallbackHint: {
    color: colors.accent,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
});
