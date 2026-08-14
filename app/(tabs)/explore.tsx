import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useAppState } from '../../context/AppStateContext';
import {
  Text,
  TacticalHeader,
  TacticalCard,
  Badge,
  BadgeColor,
  SegmentedControl,
  Divider,
  Button,
} from '../../components/ui';
import { CareerSkillTreeModal } from '../../components/skill-tree/CareerSkillTreeModal';

interface MissionLogItem {
  id: string;
  title: string;
  category: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CORPORATE_EXCLUSIVE';
  color: BadgeColor;
  distance: string;
  rewardIdr: string;
  description: string;
  requiredSkillNodeId?: string;
  requiredSkillName?: string;
  requiredLevel?: number;
}

const ALL_MISSIONS: MissionLogItem[] = [
  {
    id: 'm-corp-01',
    title: 'Bank Central Zero-Trust Server Incident',
    category: 'CYBERSECURITY',
    status: 'CORPORATE_EXCLUSIVE',
    color: 'purple',
    distance: '1.8 KM',
    rewardIdr: 'Rp 2.500.000',
    description: 'High-security corporate banking infrastructure lockdown and threat containment audit.',
    requiredSkillNodeId: 'cyber_3',
    requiredSkillName: 'Cybersecurity Specialist (Tier 3)',
    requiredLevel: 14,
  },
  {
    id: 'm-corp-02',
    title: 'Industrial Cold Chain Logistics 5MW Chiller Overhaul',
    category: 'HEAVY HVAC',
    status: 'CORPORATE_EXCLUSIVE',
    color: 'crimson',
    distance: '5.2 KM',
    rewardIdr: 'Rp 1.800.000',
    description: 'Megawatt cold storage refrigeration unit overhaul & compressor re-engineering.',
    requiredSkillNodeId: 'hvac_3',
    requiredSkillName: 'Master Chiller & Cryo Specialist (Tier 3)',
    requiredLevel: 12,
  },
  {
    id: 'm-201',
    title: 'Commercial Server Maintenance',
    category: 'ELECTRONICS',
    status: 'ACTIVE',
    color: 'cyan',
    distance: '1.2 KM',
    rewardIdr: 'Rp 450.000',
    description: 'Server rack maintenance & cabling diagnostic at downtown commercial office.',
  },
  {
    id: 'm-202',
    title: 'Roadside Towing & Battery Boost',
    category: 'MECHANICAL',
    status: 'ACTIVE',
    color: 'amber',
    distance: '3.5 KM',
    rewardIdr: 'Rp 650.000',
    description: 'Vehicle breakdown on highway 4. Requires heavy towing & battery restart.',
  },
  {
    id: 'm-203',
    title: 'Multi-Split VRF Office Chiller Repair',
    category: 'HEAVY HEATING',
    status: 'PENDING',
    color: 'crimson',
    distance: '5.0 KM',
    rewardIdr: 'Rp 1.200.000',
    description: 'Urgent HVAC chiller overhaul at cold storage facility.',
    requiredSkillNodeId: 'hvac_2',
    requiredSkillName: 'Commercial VRF Specialist (Tier 2)',
    requiredLevel: 5,
  },
  {
    id: 'm-204',
    title: 'Post-Construction Deep Clean',
    category: 'CLEANING',
    status: 'COMPLETED',
    color: 'emerald',
    distance: '2.1 KM',
    rewardIdr: 'Rp 800.000',
    description: 'Full sanitization & trash removal for newly built commercial showroom.',
  },
];

export default function MissionsScreen() {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const { user } = useAppState();

  const [filter, setFilter] = useState<'ALL' | 'CORPORATE' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [isSkillTreeModalVisible, setIsSkillTreeModalVisible] = useState(false);

  const isContractUnlocked = (item: MissionLogItem): boolean => {
    if (!item.requiredSkillNodeId) return true;
    return user.unlockedSkillNodeIds.includes(item.requiredSkillNodeId);
  };

  const filteredMissions = ALL_MISSIONS.filter((m) => {
    if (filter === 'ALL') return true;
    if (filter === 'CORPORATE') return m.status === 'CORPORATE_EXCLUSIVE';
    if (filter === 'ACTIVE') return m.status === 'ACTIVE' || m.status === 'PENDING';
    if (filter === 'COMPLETED') return m.status === 'COMPLETED';
    return true;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <TacticalHeader showRoleSwitcher={false} />

      <View style={styles.content}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text variant="h2">MISSION LOG & CONTRACTS</Text>
            <Text variant="caption" color={colors.textSecondary}>
              TACTICAL CONTRACTS & CORPORATE SPECIALIZATION TIERS
            </Text>
          </View>
        </View>

        {/* Filter Switcher */}
        <SegmentedControl
          options={[
            { value: 'ALL', label: 'ALL LOGS' },
            { value: 'CORPORATE', label: 'CORPORATE' },
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'COMPLETED', label: 'COMPLETED' },
          ]}
          selectedValue={filter}
          onSelect={(val) => setFilter(val as any)}
          style={{ marginVertical: 12 }}
        />

        <Divider label={`// DISPLAYING ${filteredMissions.length} CONTRACTS`} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {filteredMissions.map((mission) => {
            const unlocked = isContractUnlocked(mission);
            const isCorporate = mission.status === 'CORPORATE_EXCLUSIVE';

            return (
              <TacticalCard
                key={mission.id}
                accent={mission.color}
                style={styles.card}
                elevated={isCorporate || mission.status === 'ACTIVE'}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.badgeRow}>
                    <Badge
                      label={isCorporate ? 'CORPORATE TIER-A' : mission.status}
                      color={mission.color}
                      variant="status"
                    />
                    {isCorporate && (
                      <Badge
                        label={unlocked ? 'CONTRACT UNLOCKED' : 'SPECIALIZATION LOCKED'}
                        color={unlocked ? 'emerald' : 'muted'}
                        variant="outline"
                        style={{ marginLeft: 6 }}
                      />
                    )}
                  </View>

                  <Text variant="mono" weight="bold" color={colors[mission.color as keyof typeof colors]}>
                    {mission.rewardIdr}
                  </Text>
                </View>

                <Text variant="h3" style={styles.title}>
                  {mission.title}
                </Text>

                <Text variant="bodySecondary" numberOfLines={2} style={styles.desc}>
                  {mission.description}
                </Text>

                {/* Skill Tree Prerequisite Banner */}
                {mission.requiredSkillName && (
                  <View
                    style={[
                      styles.prerequisiteBox,
                      {
                        backgroundColor: unlocked ? `${colors.emerald}10` : `${colors.border}30`,
                        borderColor: unlocked ? colors.emerald : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={unlocked ? 'shield-checkmark' : 'lock-closed'}
                      size={14}
                      color={unlocked ? colors.emerald : colors.textMuted}
                    />
                    <Text
                      variant="caption"
                      weight={unlocked ? 'bold' : 'regular'}
                      color={unlocked ? colors.emerald : colors.textSecondary}
                      style={{ marginLeft: 6, flex: 1 }}
                    >
                      {unlocked
                        ? `Specialization Validated: ${mission.requiredSkillName}`
                        : `Requires: ${mission.requiredSkillName}`}
                    </Text>
                  </View>
                )}

                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                  <View style={styles.footerInfo}>
                    <Ionicons name="navigate-outline" size={14} color={colors.textSecondary} />
                    <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                      {mission.distance} • {mission.category}
                    </Text>
                  </View>

                  {!unlocked ? (
                    <Button
                      title="VIEW SKILL TREE"
                      variant="outline"
                      size="sm"
                      leftIcon={<Ionicons name="git-network-outline" size={14} color={colors.primary} />}
                      onPress={() => {
                        trigger('selection');
                        setIsSkillTreeModalVisible(true);
                      }}
                    />
                  ) : (
                    <Button
                      title="ACCEPT CONTRACT"
                      variant="ghost"
                      size="sm"
                      rightIcon={<Ionicons name="chevron-forward" size={14} color={colors.primary} />}
                    />
                  )}
                </View>
              </TacticalCard>
            );
          })}
        </ScrollView>
      </View>

      {/* Skill Tree Modal */}
      <CareerSkillTreeModal
        visible={isSkillTreeModalVisible}
        onClose={() => setIsSkillTreeModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
  },
  desc: {
    marginBottom: 8,
  },
  prerequisiteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
