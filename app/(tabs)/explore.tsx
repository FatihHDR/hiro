import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ALL_MISSIONS = [
  { id: '1', title: 'Electronics Repair', type: 'electronics', color: '#00BFFF', status: 'Active', distance: '1.2km', description: 'Server rack maintenance required at downtown office.' },
  { id: '2', title: 'Roadside Assistance', type: 'mechanical', color: '#FFA500', status: 'Active', distance: '3.5km', description: 'Vehicle breakdown on highway 4, requires towing.' },
  { id: '3', title: 'Heavy Maintenance', type: 'heavy', color: '#FF4500', status: 'Pending', distance: '5.0km', description: 'Industrial AC unit malfunction, urgent repair.' },
  { id: '4', title: 'Express Delivery', type: 'delivery', color: '#32CD32', status: 'Active', distance: '0.8km', description: 'Secure document transport to legal district.' },
  { id: '5', title: 'Deep Cleaning', type: 'cleaning', color: '#9370DB', status: 'Completed', distance: '2.1km', description: 'Post-construction cleaning for new commercial space.' },
];

export default function MissionsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>MISSION LOG</ThemedText>
        <ThemedText style={styles.headerSubtitle}>TACTICAL OVERVIEW</ThemedText>
      </View>

      <View style={[styles.filterBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity style={[styles.filterTab, styles.activeTab, { borderBottomColor: theme.tint }]}>
          <ThemedText style={[styles.filterText, { color: theme.tint, fontWeight: '700' }]}>ALL</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <ThemedText style={styles.filterText}>ACTIVE</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <ThemedText style={styles.filterText}>COMPLETED</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.missionList} showsVerticalScrollIndicator={false}>
        {ALL_MISSIONS.map(mission => (
          <TouchableOpacity 
            key={mission.id} 
            style={[
              styles.missionCard, 
              { backgroundColor: theme.card, borderColor: theme.border },
              mission.status === 'Completed' && { opacity: 0.6 }
            ]}
          >
            <View style={[styles.missionColorIndicator, { backgroundColor: mission.color }]} />
            <View style={styles.missionCardContent}>
              <View style={styles.missionCardHeader}>
                <ThemedText type="defaultSemiBold" style={styles.missionTitle}>{mission.title.toUpperCase()}</ThemedText>
                <View style={[styles.statusBadge, { borderColor: mission.color }]}>
                  <ThemedText style={[styles.statusText, { color: mission.color }]}>{mission.status.toUpperCase()}</ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.missionDescription, { color: theme.icon }]} numberOfLines={2}>
                {mission.description}
              </ThemedText>
              <View style={styles.missionFooter}>
                <View style={styles.footerItem}>
                  <IconSymbol name="location.fill" size={12} color={theme.icon} />
                  <ThemedText style={[styles.footerText, { color: theme.icon }]}>{mission.distance}</ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={16} color={theme.icon} />
              </View>
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
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  filterTab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    // Style applied conditionally
  },
  filterText: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '600',
    opacity: 0.8,
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
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 14,
    letterSpacing: 0.5,
    flex: 1,
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  missionDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.2)',
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
