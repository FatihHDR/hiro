import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
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

interface MissionLogItem {
  id: string;
  title: string;
  category: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
  color: BadgeColor;
  distance: string;
  rewardIdr: string;
  description: string;
}

const ALL_MISSIONS: MissionLogItem[] = [
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
    title: 'Industrial Chiller System Repair',
    category: 'HEAVY HEATING',
    status: 'PENDING',
    color: 'crimson',
    distance: '5.0 KM',
    rewardIdr: 'Rp 1.200.000',
    description: 'Urgent HVAC chiller overhaul at cold storage facility.',
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
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  const filteredMissions = ALL_MISSIONS.filter((m) => {
    if (filter === 'ALL') return true;
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
            <Text variant="h2">MISSION LOG</Text>
            <Text variant="caption" color={colors.textSecondary}>
              TACTICAL SERVICE CONTRACTS & DISPATCH HISTORY
            </Text>
          </View>
        </View>

        {/* Filter Switcher */}
        <SegmentedControl
          options={[
            { value: 'ALL', label: 'ALL LOGS' },
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'COMPLETED', label: 'COMPLETED' },
          ]}
          selectedValue={filter}
          onSelect={(val) => setFilter(val as any)}
          style={{ marginVertical: 12 }}
        />

        <Divider label={`// DISPLAYING ${filteredMissions.length} CONTRACTS`} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {filteredMissions.map((mission) => (
            <TacticalCard
              key={mission.id}
              accent={mission.color}
              style={styles.card}
              elevated={mission.status === 'ACTIVE'}
            >
              <View style={styles.cardHeader}>
                <Badge
                  label={mission.status}
                  color={mission.color}
                  variant="status"
                />
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

              <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                <View style={styles.footerInfo}>
                  <Ionicons name="navigate-outline" size={14} color={colors.textSecondary} />
                  <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                    {mission.distance} • {mission.category}
                  </Text>
                </View>

                <Button
                  title="DETAILS"
                  variant="ghost"
                  size="sm"
                  rightIcon={<Ionicons name="chevron-forward" size={14} color={colors.primary} />}
                />
              </View>
            </TacticalCard>
          ))}
        </ScrollView>
      </View>
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
    paddingBottom: 24,
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
  title: {
    fontSize: 16,
    marginBottom: 6,
  },
  desc: {
    marginBottom: 12,
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
