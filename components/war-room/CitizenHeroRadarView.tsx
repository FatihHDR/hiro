import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import {
  Text,
  TacticalCard,
  Badge,
  BadgeColor,
  Button,
  Avatar,
  Divider,
} from '../ui';

const { width } = Dimensions.get('window');

export interface NearbyHero {
  id: string;
  name: string;
  callsign: string;
  specialty: string;
  level: number;
  rating: number;
  distance: string;
  etaMinutes: number;
  status: 'AVAILABLE' | 'EN_ROUTE' | 'BUSY';
  accent: BadgeColor;
  completedMissions: number;
  isVerified: boolean;
  x: number; // radar %
  y: number; // radar %
}

const MOCK_NEARBY_HEROES: NearbyHero[] = [
  {
    id: 'h-01',
    name: 'Alex Vance',
    callsign: 'SPECTRE-07',
    specialty: 'Commercial HVAC & Cybersecurity',
    level: 14,
    rating: 4.9,
    distance: '0.8 KM',
    etaMinutes: 6,
    status: 'AVAILABLE',
    accent: 'cyan',
    completedMissions: 48,
    isVerified: true,
    x: 32,
    y: 40,
  },
  {
    id: 'h-02',
    name: 'Sarah Connor',
    callsign: 'VALKYRIE-02',
    specialty: 'Automotive & Heavy Mechanical Repair',
    level: 11,
    rating: 5.0,
    distance: '1.4 KM',
    etaMinutes: 9,
    status: 'AVAILABLE',
    accent: 'amber',
    completedMissions: 39,
    isVerified: true,
    x: 65,
    y: 30,
  },
  {
    id: 'h-03',
    name: 'Marcus Brody',
    callsign: 'TITAN-09',
    specialty: 'High-Voltage Electrical & Hydraulics',
    level: 9,
    rating: 4.8,
    distance: '2.1 KM',
    etaMinutes: 14,
    status: 'AVAILABLE',
    accent: 'emerald',
    completedMissions: 27,
    isVerified: true,
    x: 75,
    y: 70,
  },
  {
    id: 'h-04',
    name: 'Elena Rostova',
    callsign: 'CIPHER-04',
    specialty: 'Emergency Locksmith & Access Systems',
    level: 16,
    rating: 4.95,
    distance: '2.8 KM',
    etaMinutes: 16,
    status: 'EN_ROUTE',
    accent: 'purple',
    completedMissions: 62,
    isVerified: true,
    x: 22,
    y: 75,
  },
];

interface CitizenHeroRadarViewProps {
  onDirectHire: (hero: NearbyHero) => void;
  onDeployBeaconPress: () => void;
}

export const CitizenHeroRadarView: React.FC<CitizenHeroRadarViewProps> = ({
  onDirectHire,
  onDeployBeaconPress,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();

  const [selectedHero, setSelectedHero] = useState<NearbyHero>(MOCK_NEARBY_HEROES[0]);
  const [filterSpecialty, setFilterSpecialty] = useState<string>('ALL');

  const filteredHeroes = MOCK_NEARBY_HEROES.filter((h) => {
    if (filterSpecialty === 'ALL') return true;
    if (filterSpecialty === 'HVAC') return h.specialty.includes('HVAC');
    if (filterSpecialty === 'AUTO') return h.specialty.includes('Automotive');
    if (filterSpecialty === 'ELEC') return h.specialty.includes('Electrical');
    return true;
  });

  const handleHeroSelect = (hero: NearbyHero) => {
    trigger('selection');
    setSelectedHero(hero);
  };

  return (
    <View style={styles.container}>
      {/* Radar Section */}
      <Divider label="// CITIZEN LIVE HERO RADAR (10KM RADIUS)" />

      <View style={[styles.radarBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        {/* Grid lines */}
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

        {/* Center Citizen Node (You) */}
        <View style={[styles.centerNode, { backgroundColor: colors.emerald, borderColor: colors.background }]}>
          <View style={[styles.centerPulse, { borderColor: colors.emerald }]} />
        </View>

        {/* Hero Markers */}
        {filteredHeroes.map((hero) => {
          const isSelected = selectedHero.id === hero.id;
          return (
            <Pressable
              key={hero.id}
              onPress={() => handleHeroSelect(hero)}
              style={[
                styles.heroMarker,
                {
                  left: `${hero.x}%`,
                  top: `${hero.y}%`,
                },
              ]}
            >
              <View
                style={[
                  styles.heroDot,
                  {
                    backgroundColor: colors[hero.accent as keyof typeof colors],
                    transform: [{ scale: isSelected ? 1.4 : 1 }],
                  },
                ]}
              />
              <View
                style={[
                  styles.heroRing,
                  {
                    borderColor: colors[hero.accent as keyof typeof colors],
                    borderWidth: isSelected ? 2 : 1,
                    transform: [{ scale: isSelected ? 1.3 : 1 }],
                  },
                ]}
              />
              {isSelected && (
                <View style={[styles.markerTag, { backgroundColor: colors.surfaceElevated, borderColor: colors.primary }]}>
                  <Text variant="mono" weight="bold" color={colors.primary} style={{ fontSize: 9 }}>
                    {hero.callsign}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Radar corner telemetry */}
        <View style={styles.radarHudTL}>
          <Text variant="mono" style={styles.hudText}>ACTIVE HEROES: {MOCK_NEARBY_HEROES.length}</Text>
        </View>
        <View style={styles.radarHudTR}>
          <Text variant="mono" style={styles.hudText}>RADAR SCAN: ONLINE</Text>
        </View>
      </View>

      {/* Specialty Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {[
          { id: 'ALL', label: 'ALL HEROES' },
          { id: 'HVAC', label: 'HVAC & COOLING' },
          { id: 'AUTO', label: 'AUTOMOTIVE' },
          { id: 'ELEC', label: 'ELECTRICAL' },
        ].map((f) => {
          const active = filterSpecialty === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => {
                trigger('light');
                setFilterSpecialty(f.id);
              }}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? `${colors.primary}20` : colors.surfaceElevated,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text variant="mono" weight={active ? 'bold' : 'regular'} color={active ? colors.primary : colors.textSecondary} style={{ fontSize: 10 }}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Selected Hero Tactical Dossier Card */}
      {selectedHero && (
        <TacticalCard accent={selectedHero.accent} elevated style={styles.selectedHeroCard}>
          <View style={styles.heroCardHeader}>
            <Avatar
              name={selectedHero.name}
              level={selectedHero.level}
              isVerified={selectedHero.isVerified}
              size="md"
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.callsignRow}>
                <Text variant="h3" color={colors.primary}>
                  {selectedHero.callsign}
                </Text>
                <Badge
                  label={selectedHero.status}
                  color={selectedHero.status === 'AVAILABLE' ? 'emerald' : 'amber'}
                  variant="status"
                  style={{ marginLeft: 8 }}
                />
              </View>
              <Text variant="bodySecondary" numberOfLines={1}>
                {selectedHero.specialty}
              </Text>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={[styles.heroMetrics, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
            <View style={styles.metricCol}>
              <Text variant="caption" color={colors.textMuted}>DISTANCE</Text>
              <Text variant="mono" weight="bold" color={colors.primary}>{selectedHero.distance}</Text>
            </View>
            <View style={styles.metricCol}>
              <Text variant="caption" color={colors.textMuted}>EST. ARRIVAL</Text>
              <Text variant="mono" weight="bold" color={colors.emerald}>~{selectedHero.etaMinutes} MINS</Text>
            </View>
            <View style={styles.metricCol}>
              <Text variant="caption" color={colors.textMuted}>RATING</Text>
              <Text variant="mono" weight="bold" color={colors.amber}>{selectedHero.rating} ★</Text>
            </View>
            <View style={styles.metricCol}>
              <Text variant="caption" color={colors.textMuted}>MISSIONS</Text>
              <Text variant="mono" weight="bold" color={colors.purple}>{selectedHero.completedMissions}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.heroActionRow}>
            <Button
              title="DIRECT HIRE / DISPATCH"
              variant="primary"
              size="sm"
              leftIcon={<Ionicons name="shield-checkmark" size={16} color={colors.textInverse} />}
              onPress={() => onDirectHire(selectedHero)}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="BROADCAST BEACON"
              variant="outline"
              size="sm"
              leftIcon={<Ionicons name="radio-outline" size={16} color={colors.primary} />}
              onPress={onDeployBeaconPress}
            />
          </View>
        </TacticalCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    width: 12,
    height: 12,
    marginLeft: -6,
    marginTop: -6,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    opacity: 0.7,
  },
  heroMarker: {
    position: 'absolute',
    width: 26,
    height: 26,
    marginLeft: -13,
    marginTop: -13,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  heroDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  heroRing: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.7,
  },
  markerTag: {
    position: 'absolute',
    top: -18,
    paddingHorizontal: 4,
    paddingVertical: 2,
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  selectedHeroCard: {
    marginTop: 4,
    marginBottom: 16,
  },
  heroCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callsignRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  metricCol: {
    alignItems: 'center',
  },
  heroActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
