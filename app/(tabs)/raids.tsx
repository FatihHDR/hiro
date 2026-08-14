import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
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
  TacticalCard,
  Button,
  Badge,
  BadgeColor,
  ProgressBar,
  Divider,
} from '../../components/ui';

interface RaidPartyMember {
  callsign: string;
  name: string;
  roleTitle: string;
  specialtyRequired: string;
  splitPercentage: number;
  payoutIdr: number;
  status: 'READY' | 'WORKING' | 'COMPLETED';
  isUser: boolean;
}

interface GuildRaidProject {
  id: string;
  title: string;
  clientName: string;
  location: string;
  category: string;
  accent: BadgeColor;
  totalBountyIdr: number;
  progressPercentage: number;
  status: 'IN_PROGRESS' | 'RECRUITING' | 'COMPLETED';
  members: RaidPartyMember[];
  subTasks: {
    id: string;
    title: string;
    assignedTo: string;
    completed: boolean;
  }[];
}

const INITIAL_RAIDS: GuildRaidProject[] = [
  {
    id: 'raid_01',
    title: 'Astra Menara 5-Floor Central HVAC & 3-Phase Grid Overhaul',
    clientName: 'PT Astra Menara Property',
    location: 'Sudirman Central Business District',
    category: 'HEAVY MULTI-DISCIPLINE',
    accent: 'cyan',
    totalBountyIdr: 18000000,
    progressPercentage: 75,
    status: 'IN_PROGRESS',
    members: [
      {
        callsign: 'SPECTRE-07',
        name: 'Alex Vance',
        roleTitle: 'Lead HVAC Engineer',
        specialtyRequired: 'Master Chiller Specialist (Tier 3)',
        splitPercentage: 35,
        payoutIdr: 6300000,
        status: 'COMPLETED',
        isUser: true,
      },
      {
        callsign: 'VOLT-99',
        name: 'Bambang Kusuma',
        roleTitle: 'Senior Industrial Electrician',
        specialtyRequired: '3-Phase Panel Specialist (Tier 2)',
        splitPercentage: 25,
        payoutIdr: 4500000,
        status: 'WORKING',
        isUser: false,
      },
      {
        callsign: 'SPARK-04',
        name: 'Reza Fahlevi',
        roleTitle: 'Power Distribution Tech',
        specialtyRequired: 'High-Voltage Grid (Tier 2)',
        splitPercentage: 20,
        payoutIdr: 3600000,
        status: 'WORKING',
        isUser: false,
      },
      {
        callsign: 'NEXUS-01',
        name: 'Siti Sarah',
        roleTitle: 'IoT Telemetry Integrator',
        specialtyRequired: 'Enterprise Network Engineer (Tier 2)',
        splitPercentage: 20,
        payoutIdr: 3600000,
        status: 'COMPLETED',
        isUser: false,
      },
    ],
    subTasks: [
      { id: 'st_1', title: 'Flashing & Re-Engineering Chiller Kompresor Lantai 1-3', assignedTo: 'SPECTRE-07', completed: true },
      { id: 'st_2', title: 'Kalibrasi Sensor Suhu IoT & Integrasi Modbus BMS', assignedTo: 'NEXUS-01', completed: true },
      { id: 'st_3', title: 'Rewiring Busbar Panel Distribusi 3-Phase Utama 400A', assignedTo: 'VOLT-99', completed: false },
      { id: 'st_4', title: 'Uji Beban Grounding & Thermal Imaging Circuit Breaker', assignedTo: 'SPARK-04', completed: false },
    ],
  },
  {
    id: 'raid_02',
    title: 'International Expo Center Cyber & Power Grid Setup',
    clientName: 'Nusantara Expo Convention Center',
    location: 'ICE BSD City Hall 5-7',
    category: 'CYBER & POWER',
    accent: 'purple',
    totalBountyIdr: 24000000,
    progressPercentage: 40,
    status: 'RECRUITING',
    members: [
      {
        callsign: 'SPECTRE-07',
        name: 'Alex Vance',
        roleTitle: 'Lead Security Architect',
        specialtyRequired: 'Cybersecurity Specialist (Tier 3)',
        splitPercentage: 30,
        payoutIdr: 7200000,
        status: 'READY',
        isUser: true,
      },
      {
        callsign: 'FIBER-08',
        name: 'Hendra Gunawan',
        roleTitle: '10G Fiber Splicing Specialist',
        specialtyRequired: 'Enterprise Network (Tier 2)',
        splitPercentage: 25,
        payoutIdr: 6000000,
        status: 'READY',
        isUser: false,
      },
    ],
    subTasks: [
      { id: 'st_5', title: 'Zero-Trust Firewall Deployment & Gateway VLAN Setup', assignedTo: 'SPECTRE-07', completed: false },
      { id: 'st_6', title: 'Backbone Fiber Optic 10Gbps Splicing Hall 1-8', assignedTo: 'FIBER-08', completed: false },
    ],
  },
];

export default function RaidsScreen() {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const { addXp, addCoins, depositEscrow } = useAppState();

  const [raids, setRaids] = useState<GuildRaidProject[]>(INITIAL_RAIDS);
  const [selectedRaidId, setSelectedRaidId] = useState<string>(INITIAL_RAIDS[0].id);
  const [toastMessage, setToastMessage] = useState<string>('');

  const currentRaid = raids.find((r) => r.id === selectedRaidId) || raids[0];

  const handleToggleSubTask = (taskId: string) => {
    trigger('selection');
    setRaids((prev) =>
      prev.map((r) => {
        if (r.id === currentRaid.id) {
          const updatedTasks = r.subTasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );
          const completedCount = updatedTasks.filter((t) => t.completed).length;
          const newProgress = Math.round((completedCount / updatedTasks.length) * 100);

          return {
            ...r,
            subTasks: updatedTasks,
            progressPercentage: newProgress,
          };
        }
        return r;
      })
    );
  };

  const handleExecuteMultiSplit = (raid: GuildRaidProject) => {
    trigger('success');

    const userMember = raid.members.find((m) => m.isUser);
    const userPayout = userMember ? userMember.payoutIdr : 5000000;

    // Deposit user portion of Escrow
    depositEscrow(userPayout);
    addXp(2000);
    addCoins(500);

    setRaids((prev) =>
      prev.map((r) =>
        r.id === raid.id
          ? {
              ...r,
              status: 'COMPLETED',
              progressPercentage: 100,
              subTasks: r.subTasks.map((t) => ({ ...t, completed: true })),
            }
          : r
      )
    );

    setToastMessage(
      `🏆 RAID SUKSES! ESCROW MULTI-SPLIT SELESAI: DANA RP ${userPayout.toLocaleString('id-ID')} DITERUSKAN KE VAULT ANDA (+2,000 XP & +500 HC)!`
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <TacticalHeader />

      <View style={styles.content}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text variant="h2">GUILD RAIDS & TEAM PROJECTS</Text>
            <Text variant="caption" color={colors.textSecondary}>
              MULTI-HERO TEAM CO-ORDINATION & ESCROW COMPENSATION SPLIT
            </Text>
          </View>
        </View>

        {/* Raid Selection Carousel Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.raidSelectorRow}>
          {raids.map((r) => {
            const isSelected = selectedRaidId === r.id;
            return (
              <Pressable
                key={r.id}
                onPress={() => {
                  trigger('light');
                  setSelectedRaidId(r.id);
                  setToastMessage('');
                }}
                style={[
                  styles.raidTabPill,
                  {
                    backgroundColor: isSelected ? `${colors[r.accent as keyof typeof colors]}20` : colors.surfaceElevated,
                    borderColor: isSelected ? colors[r.accent as keyof typeof colors] : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="shield-half"
                  size={16}
                  color={isSelected ? colors[r.accent as keyof typeof colors] : colors.textMuted}
                />
                <Text
                  variant="caption"
                  weight={isSelected ? 'bold' : 'regular'}
                  color={isSelected ? colors[r.accent as keyof typeof colors] : colors.textPrimary}
                  style={{ marginLeft: 6, fontSize: 11 }}
                >
                  {`${r.id.toUpperCase()} // ${r.status}`}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Toast Notification */}
        {toastMessage ? (
          <View style={[styles.toastBox, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
            <Ionicons name="trophy" size={18} color={colors.emerald} />
            <Text variant="caption" weight="bold" color={colors.emerald} style={{ marginLeft: 8, flex: 1 }}>
              {toastMessage}
            </Text>
          </View>
        ) : null}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Active Raid Project Overview Card */}
          <TacticalCard accent={currentRaid.accent} elevated style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Badge label={currentRaid.category} color={currentRaid.accent} variant="status" />
              <Text variant="mono" weight="bold" color={colors[currentRaid.accent as keyof typeof colors]} style={{ fontSize: 16 }}>
                Rp {currentRaid.totalBountyIdr.toLocaleString('id-ID')}
              </Text>
            </View>

            <Text variant="h3" style={{ fontSize: 17, marginVertical: 6 }}>
              {currentRaid.title}
            </Text>

            <Text variant="caption" color={colors.textSecondary}>
              Client: <Text variant="caption" weight="bold">{currentRaid.clientName}</Text> • Location: {currentRaid.location}
            </Text>

            <ProgressBar
              progress={currentRaid.progressPercentage / 100}
              label="SHARED RAID PROGRESS TRACKER"
              valueText={`${currentRaid.progressPercentage}% COMPLETED`}
              color={colors[currentRaid.accent as keyof typeof colors]}
              height={8}
              style={{ marginTop: 12 }}
            />
          </TacticalCard>

          {/* Team Composition & Escrow Split Ledger */}
          <Divider label={`// 1. PARTY COMPOSITION & ESCROW MULTI-SPLIT (${currentRaid.members.length} HEROES)`} />

          {currentRaid.members.map((member, idx) => (
            <TacticalCard
              key={idx}
              accent={member.isUser ? 'emerald' : 'cyan'}
              style={styles.memberCard}
              elevated={member.isUser}
            >
              <View style={styles.memberHeader}>
                <View style={styles.memberLeft}>
                  <View style={[styles.avatarBox, { backgroundColor: member.isUser ? `${colors.emerald}20` : `${colors.primary}20`, borderColor: member.isUser ? colors.emerald : colors.primary }]}>
                    <Text variant="mono" weight="bold" color={member.isUser ? colors.emerald : colors.primary} style={{ fontSize: 10 }}>
                      {member.callsign.slice(0, 4)}
                    </Text>
                  </View>

                  <View style={{ marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text variant="body" weight="bold">
                        {member.name} ({member.callsign})
                      </Text>
                      {member.isUser && (
                        <Badge label="YOU (LEAD)" color="emerald" variant="status" style={{ marginLeft: 6 }} />
                      )}
                    </View>
                    <Text variant="caption" color={colors.textSecondary}>
                      Role: {member.roleTitle}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text variant="mono" weight="bold" color={colors.emerald}>
                    Rp {member.payoutIdr.toLocaleString('id-ID')}
                  </Text>
                  <Text variant="caption" color={colors.textMuted}>
                    {member.splitPercentage}% Split
                  </Text>
                </View>
              </View>

              <View style={[styles.memberFooter, { borderTopColor: colors.border }]}>
                <Text variant="caption" color={colors.textMuted}>
                  Req: {member.specialtyRequired}
                </Text>
                <Badge
                  label={member.status}
                  color={member.status === 'COMPLETED' ? 'emerald' : 'amber'}
                  variant="status"
                />
              </View>
            </TacticalCard>
          ))}

          {/* Shared Real-Time Task Coordination */}
          <Divider label="// 2. LIVE TASK COORDINATION BOARD" />

          <TacticalCard accent="cyan" style={styles.taskBoardCard}>
            {currentRaid.subTasks.map((task) => (
              <Pressable
                key={task.id}
                onPress={() => handleToggleSubTask(task.id)}
                style={[
                  styles.taskItemRow,
                  {
                    backgroundColor: task.completed ? `${colors.emerald}10` : colors.surfaceElevated,
                    borderColor: task.completed ? colors.emerald : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={task.completed ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={task.completed ? colors.emerald : colors.textMuted}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text
                    variant="caption"
                    weight={task.completed ? 'regular' : 'semibold'}
                    color={task.completed ? colors.textMuted : colors.textPrimary}
                    style={task.completed ? { textDecorationLine: 'line-through' } : {}}
                  >
                    {task.title}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary} style={{ fontSize: 10, marginTop: 2 }}>
                    Assigned: <Text variant="caption" weight="bold" color={colors.primary}>{task.assignedTo}</Text>
                  </Text>
                </View>
              </Pressable>
            ))}

            {/* Raid Finalize & Multi-Split Payout CTA */}
            {currentRaid.status !== 'COMPLETED' ? (
              <Button
                title={`⚡ COMPLETE RAID & EXECUTE ESCROW MULTI-SPLIT`}
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<Ionicons name="checkmark-done-circle" size={18} color={colors.textInverse} />}
                onPress={() => handleExecuteMultiSplit(currentRaid)}
                style={{ marginTop: 12 }}
              />
            ) : (
              <View style={[styles.completedBanner, { backgroundColor: `${colors.emerald}15`, borderColor: colors.emerald }]}>
                <Ionicons name="shield-checkmark" size={20} color={colors.emerald} />
                <Text variant="mono" weight="bold" color={colors.emerald} style={{ marginLeft: 8 }}>
                  RAID COMPLETED // ESCROW BOUNTY TRANSFERRED
                </Text>
              </View>
            )}
          </TacticalCard>
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
    marginBottom: 8,
  },
  raidSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  raidTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  overviewCard: {
    marginBottom: 12,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberCard: {
    marginBottom: 8,
    padding: 10,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  taskBoardCard: {
    padding: 12,
  },
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 8,
  },
});
