import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useAppState } from '../../context/AppStateContext';
import {
  Text,
  TacticalHeader,
  StatTile,
  TacticalCard,
  Badge,
  BadgeColor,
  Button,
  ProgressBar,
  Divider,
  SwipeToAccept,
} from '../../components/ui';

import { RouteOptimizationModal, RouteOptimizationData } from '../../components/war-room/RouteOptimizationModal';
import { DeployBeaconModal, NewBeaconPayload } from '../../components/war-room/DeployBeaconModal';
import { CitizenHeroRadarView, NearbyHero } from '../../components/war-room/CitizenHeroRadarView';
import { ActiveMissionHUD, ActiveMissionDetail } from '../../components/war-room/ActiveMissionHUD';
import { GateBreakModal } from '../../components/war-room/GateBreakModal';
import { GateBreakCitizenModal } from '../../components/war-room/GateBreakCitizenModal';
import { EscrowVaultModal } from '../../components/escrow/EscrowVaultModal';
import { DualCurrencyShopModal } from '../../components/shop/DualCurrencyShopModal';
import { SidekickMentorshipModal } from '../../components/mentorship/SidekickMentorshipModal';

const { width } = Dimensions.get('window');

interface BeaconItem {
  id: string;
  title: string;
  category: string;
  accent: BadgeColor;
  distance: string;
  location: string;
  citizenName: string;
  rewardIdr: string;
  rewardCoins: number;
  xpReward: number;
  urgentLevel: 'NORMAL' | 'HIGH' | 'CRITICAL';
  congestionAvoidance: {
    timeSaved: number;
    avoidedZones: number;
  };
  x: number;
  y: number;
}

const INITIAL_BEACONS: BeaconItem[] = [
  {
    id: 'm-101',
    title: 'Commercial Server Maintenance',
    category: 'electronics',
    accent: 'cyan',
    distance: '1.2 KM',
    location: 'CBD Commercial Tower B',
    citizenName: 'Starlight Media Admin',
    rewardIdr: 'Rp 450.000',
    rewardCoins: 120,
    xpReward: 350,
    urgentLevel: 'HIGH',
    congestionAvoidance: { timeSaved: 12, avoidedZones: 2 },
    x: 28,
    y: 35,
  },
  {
    id: 'm-102',
    title: 'Emergency Highway Towing',
    category: 'mechanical',
    accent: 'amber',
    distance: '3.5 KM',
    location: 'Bypass Highway KM 14',
    citizenName: 'Budi Santoso',
    rewardIdr: 'Rp 650.000',
    rewardCoins: 180,
    xpReward: 500,
    urgentLevel: 'HIGH',
    congestionAvoidance: { timeSaved: 18, avoidedZones: 3 },
    x: 68,
    y: 65,
  },
  {
    id: 'm-103',
    title: 'Industrial Chiller Overhaul',
    category: 'heavy',
    accent: 'crimson',
    distance: '5.0 KM',
    location: 'South Industrial Logistics Hub',
    citizenName: 'ColdChain Logistics Ltd',
    rewardIdr: 'Rp 1.200.000',
    rewardCoins: 350,
    xpReward: 850,
    urgentLevel: 'CRITICAL',
    congestionAvoidance: { timeSaved: 25, avoidedZones: 4 },
    x: 82,
    y: 22,
  },
  {
    id: 'm-104',
    title: 'Encrypted Document Escort',
    category: 'delivery',
    accent: 'emerald',
    distance: '0.8 KM',
    location: 'District Financial Center',
    citizenName: 'Apex Legal Partners',
    rewardIdr: 'Rp 250.000',
    rewardCoins: 80,
    xpReward: 200,
    urgentLevel: 'NORMAL',
    congestionAvoidance: { timeSaved: 8, avoidedZones: 1 },
    x: 42,
    y: 78,
  },
];

export default function TacticalWarRoomScreen() {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const {
    user,
    role,
    triggerEmergency,
    clearEmergency,
    activeEmergency,
    activeMissionId,
    setActiveMissionId,
  } = useAppState();

  const [beacons, setBeacons] = useState<BeaconItem[]>(INITIAL_BEACONS);
  const [selectedBeaconId, setSelectedBeaconId] = useState<string>(INITIAL_BEACONS[0].id);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals & Active Mission
  const [routeModalData, setRouteModalData] = useState<RouteOptimizationData | null>(null);
  const [isDeployModalVisible, setIsDeployModalVisible] = useState(false);
  const [isGateBreakCitizenModalVisible, setIsGateBreakCitizenModalVisible] = useState(false);
  const [isEscrowModalVisible, setIsEscrowModalVisible] = useState(false);
  const [isShopModalVisible, setIsShopModalVisible] = useState(false);
  const [isMentorshipModalVisible, setIsMentorshipModalVisible] = useState(false);
  const [activeMissionData, setActiveMissionData] = useState<ActiveMissionDetail | null>(null);

  const selectedBeacon = beacons.find((b) => b.id === selectedBeaconId) || beacons[0];

  const filteredBeacons = beacons.filter((b) => {
    if (categoryFilter === 'ALL') return true;
    return b.category === categoryFilter;
  });

  const handleBeaconPress = (beacon: BeaconItem) => {
    trigger('selection');
    setSelectedBeaconId(beacon.id);
  };

  const handleOpenRouteOptimization = (beacon: BeaconItem) => {
    trigger('light');
    setRouteModalData({
      missionId: beacon.id,
      missionTitle: beacon.title,
      destination: beacon.location,
      distance: beacon.distance,
      normalEtaMinutes: 28,
      optimizedEtaMinutes: 16,
      timeSavedMinutes: beacon.congestionAvoidance.timeSaved,
      congestionLevel: beacon.urgentLevel === 'CRITICAL' ? 'CRITICAL' : 'MODERATE',
      trafficIncidentsAvoided: beacon.congestionAvoidance.avoidedZones,
      turnSteps: [
        { instruction: 'Mulai dari Tactical Station, arahkan ke Jl. Gatot Subroto', distance: '400 M' },
        { instruction: '⚡ Beralih ke Jalur Layang Bypass KM-4 (Menghindari kemacetan parah di perempatan kuningan)', distance: '1.8 KM', isAvoidanceBypass: true },
        { instruction: 'Ambil pintu keluar Sudirman Barat menuju lokasi target', distance: '800 M' },
        { instruction: `Tiba di tujuan: ${beacon.location}`, distance: '200 M' },
      ],
    });
  };

  const handleAcceptMission = (beacon: BeaconItem) => {
    trigger('success');
    setActiveMissionId(beacon.id);
    setActiveMissionData({
      id: beacon.id,
      title: beacon.title,
      category: beacon.category,
      location: beacon.location,
      citizenName: beacon.citizenName,
      rewardIdr: beacon.rewardIdr,
      rewardCoins: beacon.rewardCoins,
      xpReward: beacon.xpReward,
      distance: beacon.distance,
      etaMinutes: 14,
    });
  };

  const handleDeployNewBeacon = (payload: NewBeaconPayload) => {
    const newBeacon: BeaconItem = {
      id: `m-${Date.now().toString().slice(-3)}`,
      title: payload.title,
      category: payload.category,
      accent: payload.accent,
      distance: '1.1 KM',
      location: payload.location,
      citizenName: user.name || 'Citizen Client',
      rewardIdr: payload.rewardIdr,
      rewardCoins: payload.rewardCoins,
      xpReward: 400,
      urgentLevel: payload.urgentLevel,
      congestionAvoidance: { timeSaved: 15, avoidedZones: 2 },
      x: Math.floor(Math.random() * 60) + 20,
      y: Math.floor(Math.random() * 60) + 20,
    };

    setBeacons([newBeacon, ...beacons]);
    setSelectedBeaconId(newBeacon.id);
  };

  const handleDirectHireHero = (hero: NearbyHero) => {
    trigger('success');
    // Post direct beacon to this hero
    const directBeacon: BeaconItem = {
      id: `m-dir-${Date.now().toString().slice(-3)}`,
      title: `Direct Request: ${hero.specialty}`,
      category: 'electronics',
      accent: hero.accent,
      distance: hero.distance,
      location: 'Central Citizen Residence',
      citizenName: user.name || 'Citizen Client',
      rewardIdr: 'Rp 650.000',
      rewardCoins: 180,
      xpReward: 450,
      urgentLevel: 'HIGH',
      congestionAvoidance: { timeSaved: 14, avoidedZones: 2 },
      x: hero.x,
      y: hero.y,
    };
    setBeacons([directBeacon, ...beacons]);
    setSelectedBeaconId(directBeacon.id);
  };

  const handleEmergencyTrigger = () => {
    trigger('heavy');
    if (role === 'citizen') {
      setIsGateBreakCitizenModalVisible(true);
    } else {
      triggerEmergency({
        id: 'gb-999',
        title: 'CRITICAL NETWORK & POWER SYSTEM COLLAPSE',
        category: 'network',
        description: 'Main corporate server array offline with power failure right before executive client audit.',
        location: 'Enterprise Plaza Level 18',
        flatFee: 1750000,
        timeRemainingSeconds: 300,
        citizenName: 'Starlight Corp Admin',
        urgentLevel: 'CRITICAL',
      });
    }
  };

  const handleEmergencyAccept = () => {
    if (!activeEmergency) return;
    clearEmergency();
    setActiveMissionId(activeEmergency.id);
    setActiveMissionData({
      id: activeEmergency.id,
      title: activeEmergency.title,
      category: activeEmergency.category,
      location: activeEmergency.location,
      citizenName: activeEmergency.citizenName,
      rewardIdr: `Rp ${activeEmergency.flatFee.toLocaleString('id-ID')}`,
      rewardCoins: 400,
      xpReward: 1000,
      distance: '1.5 KM',
      etaMinutes: 8,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* HUD Header with Live Telemetry */}
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
              subValue="Tap to Open Vault"
              accentColor={colors.emerald}
              icon={<Ionicons name="lock-closed-outline" size={16} color={colors.emerald} />}
              onPress={() => setIsEscrowModalVisible(true)}
            />
            <StatTile
              label="HERO COINS"
              value={user.heroCoins}
              subValue="Tap to Open Shop"
              accentColor={colors.amber}
              icon={<Ionicons name="shield-outline" size={16} color={colors.amber} />}
              onPress={() => setIsShopModalVisible(true)}
            />
            <StatTile
              label="RATING / MISSIONS"
              value={`${user.rating}★`}
              subValue={`${user.completedMissions} Done`}
              accentColor={colors.primary}
              icon={<Ionicons name="star-outline" size={16} color={colors.primary} />}
            />
          </View>

          {/* Apprentice Field Comms Bar (If Hero is a Mentor with Sidekicks) */}
          {role === 'hero' && user.mentorInfo.isMentor && (
            <Pressable
              onPress={() => {
                trigger('selection');
                setIsMentorshipModalVisible(true);
              }}
              style={[
                styles.apprenticeCommsBar,
                { backgroundColor: `${colors.primary}12`, borderColor: colors.primary },
              ]}
            >
              <View style={styles.apprenticeLeft}>
                <View style={[styles.liveDotSmall, { backgroundColor: colors.emerald }]} />
                <Text variant="caption" weight="bold" color={colors.primary} style={{ marginLeft: 6 }}>
                  SIDEKICK ACTIVE IN FIELD ({user.mentorInfo.sidekicks[0]?.callsign || 'NOVA-03'})
                </Text>
              </View>
              <Badge label="OPEN LIVE COMMS" color="cyan" variant="status" />
            </Pressable>
          )}
        </View>

        {/* Active Mission HUD (If a mission is currently in-progress) */}
        {activeMissionData && (
          <View style={{ marginTop: 16 }}>
            <ActiveMissionHUD
              mission={activeMissionData}
              onOpenRouteOptimizer={() => {
                const b = beacons.find((item) => item.id === activeMissionData.id) || beacons[0];
                handleOpenRouteOptimization(b);
              }}
              onComplete={() => {
                setActiveMissionData(null);
                setActiveMissionId(null);
              }}
              onCancel={() => {
                setActiveMissionData(null);
                setActiveMissionId(null);
              }}
            />
          </View>
        )}

        {/* =========================================================================
            ROLE ADAPTIVE VIEW: CITIZEN VIEW VS HERO WAR ROOM
            ========================================================================= */}
        {role === 'citizen' ? (
          /* Citizen View: Nearby Verified Heroes Radar & Broadcast Action */
          <View style={styles.citizenSection}>
            <CitizenHeroRadarView
              onDirectHire={handleDirectHireHero}
              onDeployBeaconPress={() => setIsDeployModalVisible(true)}
            />

            {/* Gate Break Emergency Button */}
            <TacticalCard accent="crimson" elevated style={styles.emergencyBanner}>
              <View style={styles.emergencyRow}>
                <Ionicons name="warning" size={22} color={colors.crimson} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text variant="h3" color={colors.crimson}>
                    GATE BREAK PROTOCOL
                  </Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    Instant emergency dispatch for critical power, flood, or locked out emergencies.
                  </Text>
                </View>
              </View>
              <Button
                title="TRIGGER GATE BREAK PROTOCOL"
                variant="emergency"
                size="md"
                leftIcon={<Ionicons name="flash" size={18} color="#FFF" />}
                onPress={handleEmergencyTrigger}
                style={{ marginTop: 12 }}
              />
            </TacticalCard>
          </View>
        ) : (
          /* Hero View: Live Tactical Radar Map & Beacons */
          <View style={styles.heroSection}>
            <Divider label="// LIVE BEACON RADAR MAP" />

            {/* Tactical Radar Display Container */}
            <View style={[styles.radarBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              {/* Grid Telemetry Overlay */}
              <View style={styles.gridOverlay}>
                {[...Array(5)].map((_, i) => (
                  <View
                    key={`h-${i}`}
                    style={[styles.gridHorizontal, { borderColor: colors.border, top: `${(i + 1) * 20}%` }]}
                  />
                ))}
                {[...Array(5)].map((_, i) => (
                  <View
                    key={`v-${i}`}
                    style={[styles.gridVertical, { borderColor: colors.border, left: `${(i + 1) * 20}%` }]}
                  />
                ))}
              </View>

              {/* Center User Node (Hero) */}
              <View style={[styles.centerNode, { backgroundColor: colors.primary, borderColor: colors.background }]} />

              {/* Interactive Mission Beacons */}
              {filteredBeacons.map((beacon) => {
                const isSelected = selectedBeacon.id === beacon.id;
                return (
                  <Pressable
                    key={beacon.id}
                    onPress={() => handleBeaconPress(beacon)}
                    style={[
                      styles.beaconMarker,
                      { left: `${beacon.x}%`, top: `${beacon.y}%` },
                    ]}
                  >
                    <View
                      style={[
                        styles.beaconDot,
                        {
                          backgroundColor: colors[beacon.accent as keyof typeof colors],
                          transform: [{ scale: isSelected ? 1.4 : 1 }],
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.beaconRing,
                        {
                          borderColor: colors[beacon.accent as keyof typeof colors],
                          borderWidth: isSelected ? 2 : 1,
                          transform: [{ scale: isSelected ? 1.4 : 1 }],
                        },
                      ]}
                    />
                    {isSelected && (
                      <View style={[styles.beaconActiveTag, { backgroundColor: colors.surfaceElevated, borderColor: colors.primary }]}>
                        <Text variant="mono" weight="bold" color={colors.primary} style={{ fontSize: 9 }}>
                          {beacon.distance}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}

              {/* Corner HUD Telemetry Markers */}
              <View style={styles.radarHudTL}>
                <Text variant="mono" style={styles.hudText}>RADAR: SCANNING (10KM)</Text>
              </View>
              <View style={styles.radarHudTR}>
                <Text variant="mono" style={styles.hudText}>ACTIVE BEACONS: {filteredBeacons.length}</Text>
              </View>
            </View>

            {/* Category Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {[
                { id: 'ALL', label: 'ALL BEACONS' },
                { id: 'electronics', label: 'ELECTRONICS' },
                { id: 'mechanical', label: 'MECHANICAL' },
                { id: 'heavy', label: 'HEAVY HVAC' },
                { id: 'delivery', label: 'DELIVERY' },
              ].map((cat) => {
                const active = categoryFilter === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => {
                      trigger('light');
                      setCategoryFilter(cat.id);
                    }}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: active ? `${colors.primary}20` : colors.surfaceElevated,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      variant="mono"
                      weight={active ? 'bold' : 'regular'}
                      color={active ? colors.primary : colors.textSecondary}
                      style={{ fontSize: 10 }}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Emergency Gate Break Protocol Quick Trigger (For demo/testing) */}
            <View style={styles.emergencyBannerSection}>
              <TacticalCard accent="crimson" elevated>
                <View style={styles.emergencyCardContent}>
                  <View style={styles.emergencyHeader}>
                    <Ionicons name="warning-outline" size={20} color={colors.crimson} />
                    <Text variant="h3" color={colors.crimson} style={styles.emergencyTitle}>
                      GATE BREAK PROTOCOL // EMERGENCY DISPATCH
                    </Text>
                  </View>
                  <Text variant="bodySecondary" style={styles.emergencySub}>
                    Instant high-priority emergency dispatch for critical system outages.
                  </Text>
                  <Button
                    title="TRIGGER GATE BREAK PROTOCOL"
                    variant="emergency"
                    size="md"
                    leftIcon={<Ionicons name="flash-outline" size={18} color="#FFF" />}
                    onPress={handleEmergencyTrigger}
                    style={{ marginTop: 10 }}
                  />
                </View>
              </TacticalCard>
            </View>

            <Divider label={`// ACTIVE BEACON CONTRACTS (${filteredBeacons.length})`} />

            {/* Interactive Beacon Cards with SwipeToAccept & Route Optimization */}
            {filteredBeacons.map((b) => {
              const isSelected = selectedBeacon.id === b.id;
              const isThisMissionActive = activeMissionId === b.id;

              return (
                <TacticalCard
                  key={b.id}
                  accent={b.accent}
                  elevated={isSelected}
                  style={[
                    styles.beaconCard,
                    isSelected && { borderColor: colors[b.accent as keyof typeof colors], borderWidth: 1.5 },
                  ]}
                >
                  <View style={styles.beaconCardHeader}>
                    <Badge label={b.category.toUpperCase()} color={b.accent} variant="status" />
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
                      {b.location} ({b.distance}) • Client: <Text variant="caption" weight="bold">{b.citizenName}</Text>
                    </Text>
                  </View>

                  {/* Route Optimization Telemetry Quick Button */}
                  <Pressable
                    onPress={() => handleOpenRouteOptimization(b)}
                    style={[
                      styles.routeTelemetryBar,
                      { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                    ]}
                  >
                    <Ionicons name="navigate-circle-outline" size={16} color={colors.primary} />
                    <Text variant="caption" color={colors.primary} weight="bold" style={{ marginLeft: 6, flex: 1 }}>
                      TACTICAL ROUTE: Avoided {b.congestionAvoidance.avoidedZones} traffic zones (-{b.congestionAvoidance.timeSaved} mins)
                    </Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                  </Pressable>

                  {/* Interactive Swipe-To-Accept Slider */}
                  {!isThisMissionActive ? (
                    <SwipeToAccept
                      title="SWIPE TO ACCEPT MISSION"
                      successTitle="MISSION ACCEPTED & DISPATCHED"
                      accentColor={colors[b.accent as keyof typeof colors]}
                      onAccept={() => handleAcceptMission(b)}
                    />
                  ) : (
                    <View style={[styles.activeMissionBadge, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.emerald} />
                      <Text variant="mono" weight="bold" color={colors.emerald} style={{ marginLeft: 6 }}>
                        CURRENTLY ACTIVE IN DISPATCH HUD
                      </Text>
                    </View>
                  )}
                </TacticalCard>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Route Optimization Modal */}
      <RouteOptimizationModal
        visible={!!routeModalData}
        data={routeModalData}
        onClose={() => setRouteModalData(null)}
        onStartNavigation={() => {
          setRouteModalData(null);
          if (selectedBeacon) {
            handleAcceptMission(selectedBeacon);
          }
        }}
      />

      {/* Citizen Deploy Beacon Modal */}
      <DeployBeaconModal
        visible={isDeployModalVisible}
        onClose={() => setIsDeployModalVisible(false)}
        onDeploy={handleDeployNewBeacon}
      />

      {/* Citizen Gate Break Emergency Launcher Modal */}
      <GateBreakCitizenModal
        visible={isGateBreakCitizenModalVisible}
        onClose={() => setIsGateBreakCitizenModalVisible(false)}
        onEmergencyDispatched={() => {
          setIsGateBreakCitizenModalVisible(false);
        }}
      />

      {/* Gate Break Emergency Full Screen Takeover Modal */}
      <GateBreakModal
        visible={!!activeEmergency}
        onAcceptEmergency={handleEmergencyAccept}
        onDecline={() => clearEmergency()}
      />

      {/* Escrow Vault Financial Management Modal */}
      <EscrowVaultModal
        visible={isEscrowModalVisible}
        onClose={() => setIsEscrowModalVisible(false)}
      />

      {/* Dual-Currency Reward Shop Modal */}
      <DualCurrencyShopModal
        visible={isShopModalVisible}
        onClose={() => setIsShopModalVisible(false)}
      />

      {/* Sidekick Mentorship & Live Comms Modal */}
      <SidekickMentorshipModal
        visible={isMentorshipModalVisible}
        onClose={() => setIsMentorshipModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  telemetrySection: {
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  apprenticeCommsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  apprenticeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  citizenSection: {
    marginTop: 8,
  },
  heroSection: {
    marginTop: 4,
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
    width: 26,
    height: 26,
    marginLeft: -13,
    marginTop: -13,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  beaconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  beaconRing: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    opacity: 0.7,
  },
  beaconActiveTag: {
    position: 'absolute',
    top: -16,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    borderWidth: 1,
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
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  emergencyBannerSection: {
    marginBottom: 12,
  },
  emergencyBanner: {
    marginTop: 12,
    marginBottom: 16,
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 13,
  },
  emergencySub: {
    marginTop: 2,
    fontSize: 11,
  },
  beaconCard: {
    marginBottom: 14,
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
    marginBottom: 8,
  },
  routeTelemetryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  activeMissionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 8,
  },
});
