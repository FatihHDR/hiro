import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useAppState } from '../../context/AppStateContext';
import {
  Text,
  TacticalCard,
  Button,
  Badge,
  Divider,
} from '../ui';

interface GateBreakModalProps {
  visible: boolean;
  onAcceptEmergency: () => void;
  onDecline: () => void;
}

export const GateBreakModal: React.FC<GateBreakModalProps> = ({
  visible,
  onAcceptEmergency,
  onDecline,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const { user, activeEmergency, clearEmergency } = useAppState();

  const [countdown, setCountdown] = useState(300); // 5 minutes standard emergency window
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!visible) return;

    // Trigger urgent alarm haptics
    trigger('heavy');

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: false,
        }),
      ])
    );
    glow.start();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          clearEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      pulse.stop();
      glow.stop();
      clearInterval(interval);
    };
  }, [visible, clearEmergency, pulseAnim, glowAnim, trigger]);

  if (!activeEmergency) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onDecline}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              borderColor: colors.crimson,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {/* Flashing Emergency Header Banner */}
          <View style={[styles.emergencyHeader, { backgroundColor: colors.crimson }]}>
            <Ionicons name="warning" size={24} color="#FFF" />
            <Text variant="h3" color="#FFF" style={styles.headerText}>
              GATE BREAK PROTOCOL // CRITICAL DISPATCH
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Urgent Priority Countdown Banner */}
            <View style={[styles.timerBox, { backgroundColor: `${colors.crimson}15`, borderColor: colors.crimson }]}>
              <View style={styles.timerRow}>
                <Ionicons name="stopwatch-outline" size={22} color={colors.crimson} />
                <Text variant="mono" weight="bold" color={colors.crimson} style={styles.timerText}>
                  RESPONSE WINDOW: {timeFormatted}
                </Text>
              </View>
              <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
                Instant emergency bypass triggered. Direct qualification match assigned to your callsign.
              </Text>
            </View>

            {/* Operator Qualification Match Card */}
            <TacticalCard accent="emerald" style={{ marginBottom: 12 }}>
              <View style={styles.qualRow}>
                <Ionicons name="shield-checkmark" size={20} color={colors.emerald} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text variant="caption" weight="bold" color={colors.emerald}>
                    QUALIFIED OPERATOR MATCH VERIFIED
                  </Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    {user.callsign} ({user.rankTitle}) matched via verified KYC discipline.
                  </Text>
                </View>
              </View>
            </TacticalCard>

            <TacticalCard accent="crimson" elevated style={styles.detailsCard}>
              <View style={styles.badgeRow}>
                <Badge label={activeEmergency.urgentLevel} color="crimson" variant="status" />
                <Badge label={activeEmergency.category.toUpperCase()} color="amber" variant="outline" />
                <Badge label="ZERO-NEGOTIATION BYPASS" color="purple" variant="status" />
              </View>

              <Text variant="h2" color={colors.crimson} style={{ marginTop: 8, marginBottom: 4 }}>
                {activeEmergency.title}
              </Text>

              <Text variant="body" color={colors.textPrimary} style={{ marginBottom: 12 }}>
                {activeEmergency.description}
              </Text>

              <View style={styles.metaRow}>
                <Ionicons name="location" size={16} color={colors.crimson} />
                <Text variant="bodySecondary" color={colors.textPrimary} style={{ marginLeft: 6, flex: 1 }}>
                  {activeEmergency.location}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 6 }}>
                  Client: <Text variant="caption" weight="bold">{activeEmergency.citizenName}</Text>
                </Text>
              </View>
            </TacticalCard>

            <Divider label="// GUARANTEED ESCROW COMPENSATION" />

            {/* Escrow Fee Card */}
            <View style={[styles.feeCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.emerald }]}>
              <View>
                <Text variant="caption" color={colors.textMuted}>GUARANTEED ESCROW FLAT FEE</Text>
                <Text variant="h2" color={colors.emerald}>
                  Rp {activeEmergency.flatFee.toLocaleString('id-ID')}
                </Text>
              </View>
              <Badge label="INSTANT RELEASE" color="emerald" variant="status" />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button
              title="⚡ INSTANT ACCEPT & DISPATCH"
              variant="emergency"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="flash" size={20} color="#FFF" />}
              onPress={() => {
                trigger('success');
                onAcceptEmergency();
              }}
              style={{ marginBottom: 8 }}
            />
            <Button
              title="DECLINE / PASS DISPATCH"
              variant="ghost"
              size="sm"
              fullWidth
              onPress={() => {
                trigger('light');
                onDecline();
              }}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  headerText: {
    letterSpacing: 1,
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
  },
  timerBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerText: {
    fontSize: 15,
    letterSpacing: 1,
  },
  qualRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsCard: {
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  feeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
