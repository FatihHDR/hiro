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
import { useAppState } from '../../context/AppStateContext';
import {
  Text,
  TacticalCard,
  Input,
  Button,
  BadgeColor,
  Divider,
} from '../ui';

export interface NewBeaconPayload {
  title: string;
  category: string;
  accent: BadgeColor;
  location: string;
  description: string;
  rewardIdr: string;
  rewardCoins: number;
  urgentLevel: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

interface DeployBeaconModalProps {
  visible: boolean;
  onClose: () => void;
  onDeploy: (payload: NewBeaconPayload) => void;
}

const CATEGORIES: {
  id: string;
  label: string;
  accent: BadgeColor;
  defaultIdr: string;
  coins: number;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: 'electronics',
    label: 'ELECTRICAL & ELECTRONICS',
    accent: 'cyan',
    defaultIdr: 'Rp 450.000',
    coins: 120,
    icon: 'hardware-chip-outline',
  },
  {
    id: 'mechanical',
    label: 'MECHANICAL & TOWING',
    accent: 'amber',
    defaultIdr: 'Rp 650.000',
    coins: 180,
    icon: 'car-outline',
  },
  {
    id: 'heavy',
    label: 'HEAVY HVAC & COOLING',
    accent: 'crimson',
    defaultIdr: 'Rp 1.200.000',
    coins: 350,
    icon: 'snow-outline',
  },
  {
    id: 'delivery',
    label: 'FAST EMERGENCY DELIVERY',
    accent: 'emerald',
    defaultIdr: 'Rp 250.000',
    coins: 80,
    icon: 'bicycle-outline',
  },
  {
    id: 'network',
    label: 'NETWORK & CYBERSECURITY',
    accent: 'purple',
    defaultIdr: 'Rp 950.000',
    coins: 240,
    icon: 'server-outline',
  },
];

export const DeployBeaconModal: React.FC<DeployBeaconModalProps> = ({
  visible,
  onClose,
  onDeploy,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const { depositEscrow } = useAppState();

  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(CATEGORIES[0].defaultIdr);
  const [isUrgent, setIsUrgent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectCat = (cat: typeof CATEGORIES[0]) => {
    setSelectedCat(cat);
    setBudget(cat.defaultIdr);
    trigger('selection');
  };

  const handleDeployPress = () => {
    if (!title.trim()) {
      setErrorMsg('Judul Misi / Masalah wajib diisi.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Alamat / Lokasi target wajib diisi.');
      return;
    }

    setErrorMsg('');
    trigger('success');

    // Deposit simulated escrow funds
    const cleanNumber = parseInt(budget.replace(/[^0-9]/g, ''), 10) || 500000;
    depositEscrow(cleanNumber);

    onDeploy({
      title: title.trim(),
      category: selectedCat.id,
      accent: selectedCat.accent,
      location: location.trim(),
      description: description.trim() || 'Tactical service request posted via Citizen Radar.',
      rewardIdr: budget,
      rewardCoins: selectedCat.coins,
      urgentLevel: isUrgent ? 'CRITICAL' : 'HIGH',
    });

    setTitle('');
    setLocation('');
    setDescription('');
    onClose();
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
            { backgroundColor: colors.surface, borderColor: colors.primary },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <Ionicons name="radio" size={18} color={colors.primary} />
              <Text variant="h3" color={colors.primary} style={{ marginLeft: 8 }}>
                DEPLOY SERVICE BEACON
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
            <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: 12 }}>
              Pancarkan sinyal suar (*beacon*) ke Tactical War Room agar Hero terverifikasi terdekat dapat langsung mengambil misi Anda.
            </Text>

            <Divider label="// 1. SELECT SERVICE DISCIPLINE" />

            <View style={styles.catGrid}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCat.id === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => handleSelectCat(cat)}
                    style={[
                      styles.catCard,
                      {
                        backgroundColor: isSelected ? `${colors[cat.accent as keyof typeof colors]}15` : colors.surfaceElevated,
                        borderColor: isSelected ? colors[cat.accent as keyof typeof colors] : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={20}
                      color={colors[cat.accent as keyof typeof colors]}
                    />
                    <Text
                      variant="caption"
                      weight={isSelected ? 'bold' : 'regular'}
                      color={isSelected ? colors[cat.accent as keyof typeof colors] : colors.textPrimary}
                      style={{ marginTop: 4, textAlign: 'center', fontSize: 10 }}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Divider label="// 2. MISSION PARAMETERS" />

            <Input
              label="MISSION TITLE / ISSUE"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Servis Kompresor AC Central Kantor"
              errorText={errorMsg}
            />

            <Input
              label="TARGET LOCATION"
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Menara Sudirman Lt. 14, Jakarta"
              leftIcon={<Ionicons name="location-outline" size={16} color={colors.primary} />}
            />

            <Input
              label="DETAILED PROBLEM DESCRIPTION"
              value={description}
              onChangeText={setDescription}
              placeholder="Jelaskan kendala teknis dan instruksi akses lapangan..."
              multiline
              numberOfLines={3}
            />

            <Input
              label="ESCROW VAULT BUDGET ALLOCATION"
              value={budget}
              onChangeText={setBudget}
              placeholder="Rp 500.000"
              mono
              leftIcon={<Ionicons name="lock-closed-outline" size={16} color={colors.emerald} />}
            />

            {/* Urgent Priority Toggle */}
            <Pressable
              onPress={() => {
                trigger('selection');
                setIsUrgent(!isUrgent);
              }}
              style={[
                styles.urgentToggle,
                {
                  backgroundColor: isUrgent ? `${colors.crimson}15` : colors.surfaceElevated,
                  borderColor: isUrgent ? colors.crimson : colors.border,
                },
              ]}
            >
              <Ionicons
                name={isUrgent ? 'flash' : 'flash-outline'}
                size={20}
                color={isUrgent ? colors.crimson : colors.textMuted}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text variant="body" weight="bold" color={isUrgent ? colors.crimson : colors.textPrimary}>
                  HIGH-PRIORITY RADAR BROADCAST
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  Pancarkan sinyal prioritas tinggi dengan alarm ke Hero radius terdekat.
                </Text>
              </View>
            </Pressable>

            {/* Escrow Guarantee Note */}
            <TacticalCard accent="emerald" style={{ marginTop: 12 }}>
              <View style={styles.escrowRow}>
                <Ionicons name="shield-checkmark" size={20} color={colors.emerald} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text variant="caption" weight="bold" color={colors.emerald}>
                    SECURE ESCROW VAULT PROTECTION
                  </Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    Dana Anda diamankan di Escrow Vault dan hanya akan diteruskan ke Hero setelah Anda mengonfirmasi penyelesaian tugas.
                  </Text>
                </View>
              </View>
            </TacticalCard>
          </ScrollView>

          {/* Footer CTA */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button
              title="BROADCAST BEACON TO WAR ROOM"
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="radio-outline" size={18} color={colors.textInverse} />}
              onPress={handleDeployPress}
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
    height: '86%',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  catCard: {
    width: '48%',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  urgentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  escrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
