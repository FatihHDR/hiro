import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useAppState } from '../../context/AppStateContext';
import {
  Text,
  TacticalHeader,
  StatTile,
  TacticalCard,
  Badge,
  Button,
  ProgressBar,
  Divider,
} from '../../components/ui';

const { width } = Dimensions.get('window');

const MOCK_BEACONS = [
  {
    id: 'm-101',
    title: 'Commercial Server Maintenance',
    category: 'electronics',
    accent: 'cyan' as const,
    distance: '1.2 KM',
    location: 'CBD Commercial Tower B',
    rewardIdr: 'Rp 450.000',
    rewardCoins: 120,
    urgentLevel: 'HIGH',
    x: 28,
    y: 35,
  },
  {
    id: 'm-102',
    title: 'Emergency Highway Towing',
    category: 'mechanical',
    accent: 'amber' as const,
    distance: '3.5 KM',
    location: 'Bypass Highway KM 14',
    rewardIdr: 'Rp 650.000',
    rewardCoins: 180,
    urgentLevel: 'HIGH',
    x: 68,
    y: 65,
  },
  {
    id: 'm-103',
    title: 'Industrial Chiller Overhaul',
    category: 'heavy',
    accent: 'crimson' as const,
    distance: '5.0 KM',
    location: 'South Industrial Logistics Hub',
    rewardIdr: 'Rp 1.200.000',
    rewardCoins: 350,
    urgentLevel: 'CRITICAL',
    x: 82,
    y: 22,
  },
  {
    id: 'm-104',
    title: 'Encrypted Document Escort',
    category: 'delivery',
    accent: 'emerald' as const,
    distance: '0.8 KM',
    location: 'District Financial Center',
    rewardIdr: 'Rp 250.000',
    rewardCoins: 80,
    urgentLevel: 'NORMAL',
    x: 42,
    y: 78,
  },
];

export default function TacticalWarRoomScreen() {
  const { colors } = useTheme();
  const { user, role, triggerEmergency } = useAppState();

  const handleEmergencyPress = () => {
    triggerEmergency({
      id: 'gb-999',
      title: 'CRITICAL NETWORK SYSTEM FAILURE',
      category: 'network',
      description: 'Corporate server array offline right before executive presentation.',
      location: 'Enterprise Plaza Level 18',
      flatFee: 1500000,
      timeRemainingSeconds: 300,
      citizenName: 'Starlight Corp Admin',
      urgentLevel: 'CRITICAL',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* HUD Header */}
      <TacticalHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Telemetry & RPG Progression Bar */}
        <View style={styles.telemetrySection}>
          <ProgressBar
            progress={user.xp / user.nextLevelXp}
            label={`RANK PROGRESS // LEVEL ${user.level}`}
            valueText={`${user.xp.toLocaleString()} / ${user.nextLevelXp.toLocaleString()} XP`}
            color={colors.primary}
            height={6}
          />

          {/* Key Metric Tiles */}
          <View style={styles.statsGrid}>
            <StatTile
              label="ESCROW VAULT"
              value={`Rp ${(user.escrowBalance / 1000).toFixed(0)}k`}
              subValue="Secured Funds"
              accentColor={colors.emerald}
              icon={<Ionicons name="lock-closed-outline" size={16} color={colors.emerald} />}
            />
            <StatTile
              label="HERO COINS"
              value={user.heroCoins}
              subValue="Reward Token"
              accentColor={colors.amber}
              icon={<Ionicons name="shield-outline" size={16} color={colors.amber} />}
            />
            <StatTile
              label="RATING / MISSIONS"
              value={`${user.rating}★`}
              subValue={`${user.completedMissions} Done`}
              accentColor={colors.primary}
              icon={<Ionicons name="star-outline" size={16} color={colors.primary} />}
            />
          </View>
        </View>

        <Divider label="// LIVE BEACON RADAR MAP" />

        {/* Tactical Radar Display Container */}
        <View style={[styles.radarBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          {/* Grid Telemetry Overlay */}
          <View style={styles.gridOverlay}>
            {[...Array(5)].map((_, i) => (
              <View
                key={`h-${i}`}
                style={[
                  styles.gridHorizontal,
                  { borderColor: colors.border, top: `${(i + 1) * 20}%` },
                ]}
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <View
                key={`v-${i}`}
                style={[
                  styles.gridVertical,
                  { borderColor: colors.border, left: `${(i + 1) * 20}%` },
                ]}
              />
            ))}
          </View>

          {/* Center User Node */}
          <View style={[styles.centerNode, { backgroundColor: colors.primary, borderColor: colors.background }]} />

          {/* Interactive Mission Beacons */}
          {MOCK_BEACONS.map((beacon) => (
            <View
              key={beacon.id}
              style={[
                styles.beaconMarker,
                { left: `${beacon.x}%`, top: `${beacon.y}%` },
              ]}
            >
              <View style={[styles.beaconDot, { backgroundColor: colors[beacon.accent as keyof typeof colors] }]} />
              <View style={[styles.beaconRing, { borderColor: colors[beacon.accent as keyof typeof colors] }]} />
            </View>
          ))}

          {/* Corner HUD Telemetry Markers */}
          <View style={styles.radarHudTL}>
            <Text variant="mono" style={styles.hudText}>RADAR: SCANNING (10KM)</Text>
          </View>
          <View style={styles.radarHudTR}>
            <Text variant="mono" style={styles.hudText}>BEACONS: {MOCK_BEACONS.length}</Text>
          </View>
        </View>

        {/* Emergency Dispatch Gate Break Protocol Trigger */}
        <View style={styles.emergencyBannerSection}>
          <TacticalCard accent="crimson" elevated>
            <View style={styles.emergencyCardContent}>
              <View style={styles.emergencyHeader}>
                <Ionicons name="warning-outline" size={20} color={colors.crimson} />
                <Text variant="h3" color={colors.crimson} style={styles.emergencyTitle}>
                  GATE BREAK PROTOCOL
                </Text>
              </View>
              <Text variant="bodySecondary" style={styles.emergencySub}>
                Instant high-priority emergency dispatch for critical system & infrastructure outages.
              </Text>
              <Button
                title="TRIGGER GATE BREAK PROTOCOL"
                variant="emergency"
                size="md"
                leftIcon={<Ionicons name="flash-outline" size={18} color="#FFF" />}
                onPress={handleEmergencyPress}
                style={{ marginTop: 12 }}
              />
            </View>
          </TacticalCard>
        </View>

        <Divider label="// ACTIVE BEACON REQUESTS" />

        {/* Beacon Request Cards */}
        {MOCK_BEACONS.map((b) => (
          <TacticalCard
            key={b.id}
            accent={b.accent}
            style={styles.beaconCard}
          >
            <View style={styles.beaconCardHeader}>
              <Badge
                label={b.category.toUpperCase()}
                color={b.accent}
                variant="status"
              />
              <Text variant="mono" weight="bold" color={colors[b.accent as keyof typeof colors]}>
                {b.rewardIdr} + {b.rewardCoins} HC
              </Text>
            </View>

            <Text variant="h3" style={styles.cardTitle}>
              {b.title}
            </Text>

            <View style={styles.beaconLocationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                {b.location} ({b.distance})
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <Button
                title={role === 'hero' ? 'SWIPE TO ACCEPT MISSION' : 'VIEW MISSION DETAILS'}
                variant={role === 'hero' ? 'primary' : 'secondary'}
                size="sm"
                rightIcon={<Ionicons name="arrow-forward-outline" size={14} color={role === 'hero' ? colors.textInverse : colors.textPrimary} />}
                fullWidth
              />
            </View>
          </TacticalCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  telemetrySection: {
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  radarBox: {
    height: width * 0.72,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridHorizontal: {
    position: 'absolute',
    width: '100%',
    borderTopWidth: 1,
    opacity: 0.15,
  },
  gridVertical: {
    position: 'absolute',
    height: '100%',
    borderLeftWidth: 1,
    opacity: 0.15,
  },
  centerNode: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 10,
    height: 10,
    marginLeft: -5,
    marginTop: -5,
    borderRadius: 5,
    borderWidth: 2,
  },
  beaconMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beaconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  beaconRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    opacity: 0.6,
  },
  radarHudTL: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  radarHudTR: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  hudText: {
    fontSize: 9,
  },
  emergencyBannerSection: {
    marginTop: 16,
  },
  emergencyCardContent: {
    gap: 4,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyTitle: {
    letterSpacing: 0.8,
  },
  emergencySub: {
    marginTop: 4,
  },
  beaconCard: {
    marginBottom: 12,
  },
  beaconCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  beaconLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardFooter: {
    marginTop: 4,
  },
});
