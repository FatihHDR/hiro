import React, { useState } from 'react';
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
import { useAppState, GateBreakAlert } from '../../context/AppStateContext';
import {
  Text,
  TacticalCard,
  Input,
  Button,
  Badge,
  Divider,
} from '../ui';

interface GateBreakCitizenModalProps {
  visible: boolean;
  onClose: () => void;
  onEmergencyDispatched: () => void;
}

interface EmergencyPreset {
  id: 'locksmith' | 'plumbing' | 'electrical' | 'network' | 'vehicle';
  title: string;
  category: 'locksmith' | 'plumbing' | 'electrical' | 'network' | 'vehicle';
  description: string;
  defaultLocation: string;
  flatFee: number;
  icon: keyof typeof Ionicons.glyphMap;
  eta: string;
}

const EMERGENCY_PRESETS: EmergencyPreset[] = [
  {
    id: 'network',
    title: 'CRITICAL CORPORATE NETWORK & SERVER FAILURE',
    category: 'network',
    description: 'Server array offline & switchboard crash right before executive audit / presentation.',
    defaultLocation: 'Enterprise Tower CBD Level 18',
    flatFee: 1500000,
    icon: 'server-outline',
    eta: '< 5 MINS',
  },
  {
    id: 'plumbing',
    title: 'SEVERE PIPE BURST & HEAVY WATER LEAK',
    category: 'plumbing',
    description: 'Main water conduit burst during severe rainfall. High risk of interior structural flooding.',
    defaultLocation: 'Jl. Kemang Raya No. 42B',
    flatFee: 650000,
    icon: 'water-outline',
    eta: '< 7 MINS',
  },
  {
    id: 'locksmith',
    title: 'EMERGENCY SMART-LOCK LOCKOUT',
    category: 'locksmith',
    description: 'Electronic access deadlock malfunction. Citizen stranded outside residential suite.',
    defaultLocation: 'Senopati Suites Tower 2 Unit 12A',
    flatFee: 350000,
    icon: 'key-outline',
    eta: '< 4 MINS',
  },
  {
    id: 'electrical',
    title: 'HIGH-VOLTAGE SHORT CIRCUIT & POWER OUTAGE',
    category: 'electrical',
    description: 'Distribution panel spark and total blackout affecting critical residential systems.',
    defaultLocation: 'Pondok Indah Cluster 8',
    flatFee: 750000,
    icon: 'flash-outline',
    eta: '< 6 MINS',
  },
  {
    id: 'vehicle',
    title: 'HIGHWAY VEHICLE STALL & ROAD HAZARD',
    category: 'vehicle',
    description: 'Engine stall and transmission lock in middle express lane. Immediate towing required.',
    defaultLocation: 'Inner Ring Road KM 12',
    flatFee: 800000,
    icon: 'car-outline',
    eta: '< 8 MINS',
  },
];

export const GateBreakCitizenModal: React.FC<GateBreakCitizenModalProps> = ({
  visible,
  onClose,
  onEmergencyDispatched,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const { user, triggerEmergency, depositEscrow } = useAppState();

  const [selectedPreset, setSelectedPreset] = useState<EmergencyPreset>(EMERGENCY_PRESETS[0]);
  const [customLocation, setCustomLocation] = useState(EMERGENCY_PRESETS[0].defaultLocation);
  const [customDetails, setCustomDetails] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleSelectPreset = (preset: EmergencyPreset) => {
    trigger('selection');
    setSelectedPreset(preset);
    setCustomLocation(preset.defaultLocation);
  };

  const handleActivateEmergency = () => {
    trigger('heavy');
    setIsBroadcasting(true);

    // Auto deposit guaranteed escrow flat fee
    depositEscrow(selectedPreset.flatFee);

    // Simulate <3s latency instant dispatch match
    setTimeout(() => {
      const alert: GateBreakAlert = {
        id: `gb-${Date.now().toString().slice(-4)}`,
        title: selectedPreset.title,
        category: selectedPreset.category,
        description: customDetails.trim() || selectedPreset.description,
        location: customLocation.trim() || selectedPreset.defaultLocation,
        flatFee: selectedPreset.flatFee,
        timeRemainingSeconds: 300,
        citizenName: user.name || 'Citizen Client',
        urgentLevel: 'CRITICAL',
      };

      triggerEmergency(alert);
      setIsBroadcasting(false);
      onEmergencyDispatched();
      onClose();
    }, 1200);
  };

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
            { backgroundColor: colors.surface, borderColor: colors.crimson },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.crimson }]}>
            <View style={styles.headerLeft}>
              <Ionicons name="warning" size={20} color="#FFF" />
              <Text variant="h3" color="#FFF" style={{ marginLeft: 8, letterSpacing: 1 }}>
                GATE BREAK PROTOCOL // INSTANT DISPATCH
              </Text>
            </View>
            <Pressable
              onPress={() => {
                trigger('light');
                onClose();
              }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={22} color="#FFF" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: 12 }}>
              Protokol darurat instan memotong negosiasi standar. Sistem akan mengunci dana di Escrow dan langsung mengambil alih layar Hero terdekat berkualifikasi.
            </Text>

            <Divider label="// 1. SELECT CRITICAL INCIDENT" />

            <View style={styles.presetList}>
              {EMERGENCY_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <Pressable
                    key={preset.id}
                    onPress={() => handleSelectPreset(preset)}
                    style={[
                      styles.presetCard,
                      {
                        backgroundColor: isSelected ? `${colors.crimson}15` : colors.surfaceElevated,
                        borderColor: isSelected ? colors.crimson : colors.border,
                      },
                    ]}
                  >
                    <View style={styles.presetHeader}>
                      <Ionicons
                        name={preset.icon}
                        size={20}
                        color={isSelected ? colors.crimson : colors.textPrimary}
                      />
                      <Text
                        variant="body"
                        weight="bold"
                        color={isSelected ? colors.crimson : colors.textPrimary}
                        style={{ flex: 1, marginLeft: 8, fontSize: 13 }}
                      >
                        {preset.title}
                      </Text>
                      <Badge label={preset.eta} color="crimson" variant="status" />
                    </View>

                    <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
                      {preset.description}
                    </Text>

                    <View style={styles.presetFeeRow}>
                      <Text variant="caption" color={colors.textMuted}>GUARANTEED FLAT FEE:</Text>
                      <Text variant="mono" weight="bold" color={colors.emerald}>
                        Rp {preset.flatFee.toLocaleString('id-ID')}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Divider label="// 2. EMERGENCY INCIDENT LOCATION" />

            <Input
              label="EXACT EMERGENCY ADDRESS / ACCESS POINT"
              value={customLocation}
              onChangeText={setCustomLocation}
              placeholder="e.g. Senopati Suites Tower 2 Unit 12A"
              leftIcon={<Ionicons name="location" size={16} color={colors.crimson} />}
            />

            <Input
              label="SPECIAL HAZARD INSTRUCTIONS (OPTIONAL)"
              value={customDetails}
              onChangeText={setCustomDetails}
              placeholder="e.g. Masuk via lobi barat, bawa kunci universal atau toolkit fiber optic."
              multiline
              numberOfLines={2}
            />

            {/* Escrow Guarantee Telemetry Card */}
            <TacticalCard accent="emerald" style={{ marginTop: 6 }}>
              <View style={styles.escrowTelemetryRow}>
                <Ionicons name="shield-checkmark" size={22} color={colors.emerald} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text variant="caption" weight="bold" color={colors.emerald}>
                    ESCROW ZERO-NEGOTIATION OVERRIDE
                  </Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    Dana flat fee Rp {selectedPreset.flatFee.toLocaleString('id-ID')} diamankan otomatis di Escrow Vault. Hero dialokasikan dalam waktu &lt; 3 detik.
                  </Text>
                </View>
              </View>
            </TacticalCard>
          </ScrollView>

          {/* Footer Activation CTA */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button
              title={isBroadcasting ? "⚡ BROADCASTING ALARM (<3S LATENCY)..." : "ACTIVATE GATE BREAK OVERRIDE"}
              variant="emergency"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="flash" size={20} color="#FFF" />}
              onPress={handleActivateEmergency}
              disabled={isBroadcasting}
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '88%',
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  presetList: {
    gap: 8,
    marginBottom: 12,
  },
  presetCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetFeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  escrowTelemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
