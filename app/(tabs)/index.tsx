import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

const MISSIONS = [
  { id: '1', title: 'Electronics Repair', type: 'electronics', color: '#00BFFF', x: 20, y: 30, distance: '1.2km', description: 'Server rack maintenance required at downtown office.' },
  { id: '2', title: 'Roadside Assistance', type: 'mechanical', color: '#FFA500', x: 60, y: 70, distance: '3.5km', description: 'Vehicle breakdown on highway 4, requires towing.' },
  { id: '3', title: 'Heavy Maintenance', type: 'heavy', color: '#FF4500', x: 80, y: 20, distance: '5.0km', description: 'Industrial AC unit malfunction, urgent repair.' },
  { id: '4', title: 'Express Delivery', type: 'delivery', color: '#32CD32', x: 40, y: 80, distance: '0.8km', description: 'Secure document transport to legal district.' },
];

export default function TacticalWarRoom() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>TACTICAL WAR ROOM</ThemedText>
        <ThemedText style={styles.headerSubtitle}>LIVE MISSION RADAR</ThemedText>
      </View>

      <View style={[styles.radarContainer, { borderColor: theme.border }]}>
        <View style={styles.gridOverlay}>
          {[...Array(6)].map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineHorizontal, { borderColor: theme.border, top: `${(i + 1) * 16.6}%` }]} />
          ))}
          {[...Array(6)].map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineVertical, { borderColor: theme.border, left: `${(i + 1) * 16.6}%` }]} />
          ))}
        </View>
        
        {MISSIONS.map(mission => (
          <TouchableOpacity 
            key={mission.id} 
            style={[styles.beacon, { left: `${mission.x}%`, top: `${mission.y}%` }]}
          >
            <View style={[styles.beaconCore, { backgroundColor: mission.color }]} />
            <View style={[styles.beaconPulse, { borderColor: mission.color }]} />
          </TouchableOpacity>
        ))}
        
        <View style={[styles.centerPoint, { backgroundColor: theme.tint }]} />
      </View>

      <View style={styles.listHeader}>
        <ThemedText type="subtitle">ACTIVE MISSIONS</ThemedText>
        <IconSymbol name="line.3.horizontal.decrease.circle" size={20} color={theme.icon} />
      </View>

      <ScrollView style={styles.missionList} showsVerticalScrollIndicator={false}>
        {MISSIONS.map(mission => (
          <TouchableOpacity 
            key={mission.id} 
            style={[styles.missionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.missionColorIndicator, { backgroundColor: mission.color }]} />
            <View style={styles.missionCardContent}>
              <View style={styles.missionCardHeader}>
                <ThemedText type="defaultSemiBold" style={styles.missionTitle}>{mission.title.toUpperCase()}</ThemedText>
                <ThemedText style={styles.missionDistance}>{mission.distance}</ThemedText>
              </View>
              <ThemedText style={[styles.missionDescription, { color: theme.icon }]} numberOfLines={2}>
                {mission.description}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 12,
    letterSpacing: 2,
    opacity: 0.7,
    marginTop: 4,
  },
  radarContainer: {
    height: width * 0.8,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0A0A0A',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineHorizontal: {
    position: 'absolute',
    width: '100%',
    borderTopWidth: 1,
    opacity: 0.2,
  },
  gridLineVertical: {
    position: 'absolute',
    height: '100%',
    borderLeftWidth: 1,
    opacity: 0.2,
  },
  centerPoint: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 8,
    height: 8,
    marginLeft: -4,
    marginTop: -4,
    borderRadius: 4,
  },
  beacon: {
    position: 'absolute',
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beaconCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  beaconPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    opacity: 0.5,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  missionList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  missionCard: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  missionColorIndicator: {
    width: 4,
  },
  missionCardContent: {
    flex: 1,
    padding: 16,
  },
  missionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  missionTitle: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
  missionDistance: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  missionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
