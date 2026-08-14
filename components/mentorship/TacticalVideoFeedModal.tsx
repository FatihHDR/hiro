import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { SidekickProfile } from '../../context/AppStateContext';
import {
  Text,
  Badge,
} from '../ui';

interface TacticalVideoFeedModalProps {
  visible: boolean;
  sidekick: SidekickProfile | null;
  onClose: () => void;
}

export const TacticalVideoFeedModal: React.FC<TacticalVideoFeedModalProps> = ({
  visible,
  sidekick,
  onClose,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();

  const [isMuted, setIsMuted] = useState(false);
  const [streamSeconds, setStreamSeconds] = useState(42);
  const [thermalMode, setThermalMode] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setStreamSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!sidekick) return null;

  const formatStreamTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Simulated Camera Viewfinder */}
        <View
          style={[
            styles.viewfinder,
            {
              backgroundColor: thermalMode ? '#1a052e' : '#0a1017',
              borderColor: colors.primary,
            },
          ]}
        >
          {/* Top HUD Telemetry */}
          <View style={styles.topHud}>
            <View style={styles.streamStatusRow}>
              <View style={[styles.liveDot, { backgroundColor: colors.crimson }]} />
              <Text variant="mono" weight="bold" color={colors.crimson} style={{ fontSize: 11, marginLeft: 6 }}>
                LIVE TACTICAL STREAM
              </Text>
              <Text variant="mono" color={colors.textSecondary} style={{ fontSize: 11, marginLeft: 8 }}>
                {formatStreamTime(streamSeconds)}
              </Text>
            </View>

            <Badge
              label={`SIDEKICK: ${sidekick.callsign}`}
              color="cyan"
              variant="status"
            />
          </View>

          {/* AR Diagnostic Crosshairs & Measurement Overlay */}
          <View style={styles.centerOverlay}>
            <View style={[styles.crosshairRing, { borderColor: colors.primary }]}>
              <View style={[styles.crosshairDot, { backgroundColor: colors.primary }]} />
            </View>

            {/* AR Technical Callouts */}
            <View style={[styles.arCallout, { backgroundColor: 'rgba(0,0,0,0.75)', borderColor: colors.emerald }]}>
              <Ionicons name="scan-outline" size={14} color={colors.emerald} />
              <View style={{ marginLeft: 6 }}>
                <Text variant="mono" weight="bold" color={colors.emerald} style={{ fontSize: 10 }}>
                  AR DIAGNOSTIC TELEMETRY
                </Text>
                <Text variant="caption" color={colors.textPrimary} style={{ fontSize: 11 }}>
                  Flare Nut Torque: 18 N·m // R32 Suction: 128 PSI
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Feed Controls & Live Audio */}
          <View style={styles.bottomHud}>
            <View style={styles.sidekickInfoBadge}>
              <Ionicons name="person-circle" size={18} color={colors.primary} />
              <View style={{ marginLeft: 6 }}>
                <Text variant="body" weight="bold" color={colors.textPrimary} style={{ fontSize: 12 }}>
                  {sidekick.name} ({sidekick.specialty})
                </Text>
                <Text variant="caption" color={colors.textSecondary} style={{ fontSize: 10 }}>
                  Active Mission: {sidekick.activeMission?.title || 'Field Work'}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.controlsRow}>
              <Pressable
                onPress={() => {
                  trigger('light');
                  setThermalMode(!thermalMode);
                }}
                style={[
                  styles.controlBtn,
                  { backgroundColor: thermalMode ? `${colors.purple}40` : 'rgba(255,255,255,0.1)', borderColor: thermalMode ? colors.purple : colors.border },
                ]}
              >
                <Ionicons name="eye-outline" size={20} color={thermalMode ? colors.purple : colors.textPrimary} />
                <Text variant="mono" color={colors.textPrimary} style={{ fontSize: 9, marginTop: 2 }}>
                  {thermalMode ? 'THERMAL ON' : 'OPTICAL'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  trigger('selection');
                  setIsMuted(!isMuted);
                }}
                style={[
                  styles.controlBtn,
                  { backgroundColor: isMuted ? `${colors.crimson}30` : 'rgba(255,255,255,0.1)', borderColor: isMuted ? colors.crimson : colors.border },
                ]}
              >
                <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={20} color={isMuted ? colors.crimson : colors.emerald} />
                <Text variant="mono" color={colors.textPrimary} style={{ fontSize: 9, marginTop: 2 }}>
                  {isMuted ? 'MUTED' : 'VOICE ON'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  trigger('warning');
                  onClose();
                }}
                style={[styles.controlBtn, { backgroundColor: colors.crimson, borderColor: colors.crimson }]}
              >
                <Ionicons name="call" size={20} color={colors.textInverse} style={{ transform: [{ rotate: '135deg' }] }} />
                <Text variant="mono" weight="bold" color={colors.textInverse} style={{ fontSize: 9, marginTop: 2 }}>
                  END FEED
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    padding: 16,
  },
  viewfinder: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 16,
  },
  topHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streamStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  centerOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  crosshairDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  arCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  bottomHud: {
    gap: 12,
  },
  sidekickInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
  },
});
