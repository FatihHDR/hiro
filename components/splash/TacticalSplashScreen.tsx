import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { Text } from '../ui';

interface TacticalSplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

const { width, height } = Dimensions.get('window');

export const TacticalSplashScreen: React.FC<TacticalSplashScreenProps> = ({
  onFinish,
  durationMs = 2600,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();

  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseRing = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0.8)).current;
  const scanlineY = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  const [bootLog, setBootLog] = useState<string>('INITIALIZING HIRO CORE...');
  const [bootPercent, setBootPercent] = useState<number>(0);

  useEffect(() => {
    trigger('medium');

    // Logo pop-in animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse ring loop
    Animated.loop(
      Animated.parallel([
        Animated.timing(pulseRing, {
          toValue: 2.2,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Scanline loop
    Animated.loop(
      Animated.timing(scanlineY, {
        toValue: 140,
        duration: 1400,
        useNativeDriver: true,
      })
    ).start();

    // Boot sequence steps
    const step1 = setTimeout(() => {
      setBootLog('[OK] SECURE ESCROW ENCRYPTION LOADED');
      setBootPercent(35);
      trigger('light');
    }, 600);

    const step2 = setTimeout(() => {
      setBootLog('[OK] LIVE RADAR TELEMETRY MATRIX LINKED');
      setBootPercent(70);
      trigger('light');
    }, 1300);

    const step3 = setTimeout(() => {
      setBootLog('[OK] 21ST.DEV INTERFACE READY // ALL SYSTEMS GO');
      setBootPercent(100);
      trigger('success');
    }, 2000);

    const finishTimeout = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, durationMs);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(finishTimeout);
    };
  }, [containerOpacity, durationMs, logoOpacity, logoScale, onFinish, pulseRing, ringOpacity, scanlineY, trigger]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          opacity: containerOpacity,
        },
      ]}
    >
      {/* Background Grid Pattern */}
      <View style={styles.gridOverlay}>
        {[...Array(6)].map((_, i) => (
          <View
            key={`h-${i}`}
            style={[styles.gridHLine, { borderColor: 'rgba(255, 255, 255, 0.04)', top: `${i * 20}%` }]}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <View
            key={`v-${i}`}
            style={[styles.gridVLine, { borderColor: 'rgba(255, 255, 255, 0.04)', left: `${i * 20}%` }]}
          />
        ))}
      </View>

      {/* Center Shield & Radar Graphic */}
      <View style={styles.logoCenterContainer}>
        {/* Pulsing Radar Ring */}
        <Animated.View
          style={[
            styles.radarRing,
            {
              borderColor: colors.primary,
              transform: [{ scale: pulseRing }],
              opacity: ringOpacity,
            },
          ]}
        />

        {/* Animated Logo Shield Card */}
        <Animated.View
          style={[
            styles.shieldCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.primary,
              shadowColor: colors.primary,
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          {/* Scanline Line */}
          <Animated.View
            style={[
              styles.scanline,
              {
                backgroundColor: colors.primary,
                transform: [{ translateY: scanlineY }],
              },
            ]}
          />

          <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
        </Animated.View>
      </View>

      {/* Branding Typography */}
      <Animated.View style={[styles.titleContainer, { opacity: logoOpacity }]}>
        <Text variant="h1" mono color={colors.primary} style={styles.brandTitle}>
          HIRO
        </Text>
        <Text variant="caption" weight="bold" color={colors.textSecondary} style={styles.brandSubtitle}>
          HIRE A HERO // ON-DEMAND RPG WORK PLATFORM
        </Text>
      </Animated.View>

      {/* Boot Telemetry & Progress Bar */}
      <View style={styles.telemetryFooter}>
        <View style={styles.logRow}>
          <View style={[styles.terminalDot, { backgroundColor: colors.emerald }]} />
          <Text variant="mono" color={colors.primary} style={styles.logText}>
            {bootLog}
          </Text>
        </View>

        {/* Loading Progress Meter */}
        <View style={[styles.progressTrack, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${bootPercent}%`,
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              },
            ]}
          />
        </View>

        <View style={styles.percentRow}>
          <Text variant="mono" color={colors.textMuted} style={{ fontSize: 10 }}>
            PROTOCOL STATUS
          </Text>
          <Text variant="mono" weight="bold" color={colors.primary} style={{ fontSize: 11 }}>
            {bootPercent}%
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridHLine: {
    position: 'absolute',
    width: width,
    borderTopWidth: 1,
  },
  gridVLine: {
    position: 'absolute',
    height: height,
    borderLeftWidth: 1,
  },
  logoCenterContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  radarRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  shieldCard: {
    width: 96,
    height: 96,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  scanline: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  brandTitle: {
    fontSize: 34,
    letterSpacing: 4,
    fontWeight: '900',
  },
  brandSubtitle: {
    fontSize: 10.5,
    letterSpacing: 1.2,
    marginTop: 4,
    textAlign: 'center',
  },
  telemetryFooter: {
    position: 'absolute',
    bottom: 48,
    left: 24,
    right: 24,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  terminalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  logText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
});
