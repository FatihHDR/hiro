import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import {
  Text,
  TacticalCard,
  Button,
  Badge,
  Divider,
} from '../ui';

export interface RouteOptimizationData {
  missionId: string;
  missionTitle: string;
  destination: string;
  distance: string;
  normalEtaMinutes: number;
  optimizedEtaMinutes: number;
  timeSavedMinutes: number;
  congestionLevel: 'CLEAR' | 'MODERATE' | 'HEAVY' | 'CRITICAL';
  trafficIncidentsAvoided: number;
  turnSteps: {
    instruction: string;
    distance: string;
    isAvoidanceBypass?: boolean;
  }[];
}

interface RouteOptimizationModalProps {
  visible: boolean;
  onClose: () => void;
  onStartNavigation: () => void;
  data: RouteOptimizationData | null;
}

export const RouteOptimizationModal: React.FC<RouteOptimizationModalProps> = ({
  visible,
  onClose,
  onStartNavigation,
  data,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();

  if (!data) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.surface, borderColor: colors.primary },
          ]}
        >
          {/* Modal Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerTitleContainer}>
              <View style={[styles.liveDot, { backgroundColor: colors.emerald }]} />
              <Text variant="h3" color={colors.primary}>
                TACTICAL ROUTE OPTIMIZER
              </Text>
            </View>
            <Pressable
              onPress={() => {
                trigger('light');
                onClose();
              }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Target Destination & Title */}
            <TacticalCard accent="cyan" style={{ marginBottom: 12 }}>
              <Text variant="caption" color={colors.textMuted}>
                MISSION TARGET // {data.missionId.toUpperCase()}
              </Text>
              <Text variant="h3" style={{ marginVertical: 4 }}>
                {data.missionTitle}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color={colors.primary} />
                <Text variant="bodySecondary" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                  {data.destination}
                </Text>
              </View>
            </TacticalCard>

            {/* Traffic Congestion Avoidance Telemetry */}
            <TacticalCard accent="emerald" elevated style={{ marginBottom: 14 }}>
              <View style={styles.bypassHeader}>
                <Ionicons name="shield-checkmark" size={20} color={colors.emerald} />
                <Text variant="subheading" weight="bold" color={colors.emerald} style={{ marginLeft: 6 }}>
                  TRAFFIC CONGESTION BYPASS ACTIVE
                </Text>
              </View>

              <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4, marginBottom: 10 }}>
                Algoritma Tactical Route telah mengalihkan rute dari {data.trafficIncidentsAvoided} titik kemacetan parah di jalan protokol.
              </Text>

              <View style={styles.telemetryGrid}>
                <View style={[styles.telemetryItem, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                  <Text variant="caption" color={colors.textMuted}>OPTIMIZED ETA</Text>
                  <Text variant="h2" color={colors.emerald}>
                    {data.optimizedEtaMinutes} <Text variant="caption">MINS</Text>
                  </Text>
                  <Text variant="caption" color={colors.crimson} style={{ textDecorationLine: 'line-through' }}>
                    Normal: {data.normalEtaMinutes} mins
                  </Text>
                </View>

                <View style={[styles.telemetryItem, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                  <Text variant="caption" color={colors.textMuted}>TIME SAVED</Text>
                  <Text variant="h2" color={colors.primary}>
                    -{data.timeSavedMinutes} <Text variant="caption">MINS</Text>
                  </Text>
                  <Badge label="BYPASS ACTIVE" color="emerald" variant="status" />
                </View>
              </View>
            </TacticalCard>

            <Divider label="// TACTICAL WAYPOINT DIRECTIONS" />

            {/* Turn by turn waypoint list */}
            {data.turnSteps.map((step, idx) => (
              <View
                key={idx}
                style={[
                  styles.waypointRow,
                  {
                    borderLeftColor: step.isAvoidanceBypass ? colors.emerald : colors.border,
                    backgroundColor: step.isAvoidanceBypass ? `${colors.emerald}10` : 'transparent',
                  },
                ]}
              >
                <View style={styles.waypointIcon}>
                  <Ionicons
                    name={step.isAvoidanceBypass ? 'git-branch-outline' : 'navigate-circle-outline'}
                    size={18}
                    color={step.isAvoidanceBypass ? colors.emerald : colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight={step.isAvoidanceBypass ? 'bold' : 'regular'}>
                    {step.instruction}
                  </Text>
                  {step.isAvoidanceBypass && (
                    <Text variant="caption" color={colors.emerald} style={{ marginTop: 2 }}>
                      ⚡ Tactical Bypass: Menghindari titik macet merah
                    </Text>
                  )}
                </View>
                <Text variant="mono" color={colors.textMuted} style={styles.stepDist}>
                  {step.distance}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Modal Footer CTA */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button
              title="START TACTICAL NAVIGATION"
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="compass" size={18} color={colors.textInverse} />}
              onPress={() => {
                trigger('heavy');
                onStartNavigation();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '82%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bypassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  telemetryItem: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  waypointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderLeftWidth: 3,
    marginBottom: 8,
    borderRadius: 4,
  },
  waypointIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  stepDist: {
    fontSize: 11,
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
