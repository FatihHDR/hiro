import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import {
  useAppState,
  SidekickProfile,
} from '../../context/AppStateContext';
import {
  Text,
  TacticalCard,
  Button,
  Badge,
  Divider,
} from '../ui';
import { TacticalVideoFeedModal } from './TacticalVideoFeedModal';

interface SidekickMentorshipModalProps {
  visible: boolean;
  onClose: () => void;
}

const APPRENTICE_CANDIDATES: SidekickProfile[] = [
  {
    id: 'sk_02',
    name: 'Dimas Surya',
    callsign: 'PHANTOM-02',
    level: 2,
    specialty: 'Apprentice Network & Cable Specialist',
    status: 'STANDBY',
    completedMissions: 4,
    passiveXpContributed: 120,
    activeMission: {
      id: 'm-sk-02',
      title: 'Small Office Cat6 LAN Termination',
      category: 'NETWORK',
      location: 'BSD Green Office Park',
      status: 'IN_PROGRESS',
      xpReward: 500,
      timeRemaining: '25:10 mins',
    },
  },
];

const TECHNICAL_PRESETS = [
  '❄️ Target tekanan freon R32: 120-140 PSI pada kompresor running.',
  '⚡ Periksa voltase antar fasa (380V) sebelum reset panel utama.',
  '🔒 Bypass VLAN 10 dan cek status trunk port managed switch.',
  '🔧 Kencangkan flare nut 1/4" dengan torsi 18 N·m, cek busa sabun.',
];

export const SidekickMentorshipModal: React.FC<SidekickMentorshipModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const {
    user,
    mentorshipMessages,
    sendMentorshipMessage,
    simulateSidekickMissionComplete,
    recruitSidekick,
    dismissSidekick,
  } = useAppState();

  const [activeVideoSidekick, setActiveVideoSidekick] = useState<SidekickProfile | null>(null);
  const [selectedSidekickId, setSelectedSidekickId] = useState<string>(
    user.mentorInfo.sidekicks[0]?.id || ''
  );
  const [chatInput, setChatInput] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const sidekicks = user.mentorInfo.sidekicks;
  const currentSidekick = sidekicks.find((sk) => sk.id === selectedSidekickId) || sidekicks[0];

  const filteredMessages = mentorshipMessages.filter(
    (m) => m.sidekickId === (currentSidekick?.id || '')
  );

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim() || !currentSidekick) return;

    trigger('light');
    sendMentorshipMessage(currentSidekick.id, text.trim());
    if (!textToSend) setChatInput('');
  };

  const handleSimulateComplete = (sidekick: SidekickProfile) => {
    trigger('success');
    const res = simulateSidekickMissionComplete(sidekick.id);
    if (res) {
      setToastMessage(
        `🎉 SIDEKICK ${sidekick.callsign} MENYELESAIKAN MISI! ANDA MENDAPATKAN +${res.passiveMentorXp} PASSIVE XP (15% SPLIT)!`
      );
    }
  };

  const handleRecruitCandidate = (candidate: SidekickProfile) => {
    trigger('success');
    const ok = recruitSidekick(candidate);
    if (ok) {
      setSelectedSidekickId(candidate.id);
      setToastMessage(`🤝 BERHASIL MEREKRUT SIDEKICK BARU: ${candidate.name} (${candidate.callsign})!`);
    }
  };

  const handleGraduateSidekick = (sidekick: SidekickProfile) => {
    trigger('warning');
    dismissSidekick(sidekick.id);
    setToastMessage(`🎓 SIDEKICK ${sidekick.callsign} TELAH LULUS PROGRAM MENTORSHIP!`);
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
            <View style={styles.headerTitleRow}>
              <View style={[styles.mentorIconBox, { backgroundColor: `${colors.primary}20`, borderColor: colors.primary }]}>
                <Ionicons name="people" size={20} color={colors.primary} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text variant="h3" color={colors.primary}>
                  THE SIDEKICK SYSTEM
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  Built-in Mentorship • Live Tactical Comms & Passive XP
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                trigger('light');
                onClose();
              }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Mentorship Telemetry Hub */}
            <TacticalCard accent="cyan" elevated style={styles.telemetryCard}>
              <View style={styles.telemetryTop}>
                <View>
                  <Text variant="caption" color={colors.textMuted}>MENTOR STATUS // SPECTRE-07</Text>
                  <Text variant="h3" color={colors.primary}>
                    {sidekicks.length} / {user.mentorInfo.maxSidekicks} ACTIVE SIDEKICK SLOTS
                  </Text>
                </View>
                <Badge
                  label="15% PASSIVE XP SPLIT"
                  color="emerald"
                  variant="status"
                />
              </View>

              <View style={[styles.telemetryStatsRow, { borderTopColor: colors.border }]}>
                <View style={styles.statCol}>
                  <Text variant="caption" color={colors.textSecondary}>CUMULATIVE PASSIVE XP</Text>
                  <Text variant="h2" color={colors.emerald}>
                    +{user.mentorInfo.passiveXpEarned} <Text variant="caption">XP</Text>
                  </Text>
                </View>

                <View style={styles.statCol}>
                  <Text variant="caption" color={colors.textSecondary}>ACTIVE APPRENTICES</Text>
                  <Text variant="h2" color={colors.primary}>
                    {sidekicks.length} <Text variant="caption">HEROES</Text>
                  </Text>
                </View>
              </View>
            </TacticalCard>

            {/* Toast Feedback */}
            {toastMessage ? (
              <View style={[styles.toastBox, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
                <Ionicons name="sparkles" size={18} color={colors.emerald} />
                <Text variant="caption" weight="bold" color={colors.emerald} style={{ marginLeft: 8, flex: 1 }}>
                  {toastMessage}
                </Text>
              </View>
            ) : null}

            {/* Active Sidekicks Section */}
            <Divider label={`// 1. ACTIVE FIELD SIDEKICKS (${sidekicks.length}/2)`} />

            {sidekicks.map((sk) => {
              const isSelected = selectedSidekickId === sk.id;
              const hasActiveMission = !!sk.activeMission;

              return (
                <TacticalCard
                  key={sk.id}
                  accent={isSelected ? 'cyan' : 'emerald'}
                  elevated={isSelected}
                  style={styles.sidekickCard}
                >
                  <View style={styles.sidekickHeader}>
                    <View style={styles.sidekickHeaderLeft}>
                      <View style={[styles.skAvatar, { backgroundColor: `${colors.primary}20`, borderColor: colors.primary }]}>
                        <Text variant="mono" weight="bold" color={colors.primary}>
                          L{sk.level}
                        </Text>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text variant="h3">{sk.name}</Text>
                        <Text variant="caption" color={colors.textSecondary}>
                          {sk.callsign} • {sk.specialty}
                        </Text>
                      </View>
                    </View>

                    <Badge
                      label={hasActiveMission ? 'IN FIELD' : 'STANDBY'}
                      color={hasActiveMission ? 'amber' : 'emerald'}
                      variant="status"
                    />
                  </View>

                  {/* Active Mission Telemetry */}
                  {hasActiveMission && (
                    <View style={[styles.missionBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                      <View style={styles.missionHeaderRow}>
                        <Ionicons name="navigate" size={14} color={colors.amber} />
                        <Text variant="caption" weight="bold" color={colors.amber} style={{ marginLeft: 4, flex: 1 }}>
                          ACTIVE MISSION: {sk.activeMission?.title}
                        </Text>
                      </View>
                      <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                        Location: {sk.activeMission?.location} • Potential Reward: {sk.activeMission?.xpReward} XP
                      </Text>
                    </View>
                  )}

                  {/* Sidekick Action Toolbar */}
                  <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
                    <Button
                      title="📹 VIDEO FEED"
                      variant="outline"
                      size="sm"
                      leftIcon={<Ionicons name="videocam" size={14} color={colors.primary} />}
                      onPress={() => {
                        trigger('selection');
                        setActiveVideoSidekick(sk);
                      }}
                      style={{ flex: 1, marginRight: 6 }}
                    />

                    {hasActiveMission ? (
                      <Button
                        title="⚡ COMPLETE (+90 XP)"
                        variant="primary"
                        size="sm"
                        leftIcon={<Ionicons name="flash" size={14} color={colors.textInverse} />}
                        onPress={() => handleSimulateComplete(sk)}
                        style={{ flex: 1.2 }}
                      />
                    ) : (
                      <Button
                        title="🎓 GRADUATE"
                        variant="ghost"
                        size="sm"
                        leftIcon={<Ionicons name="school-outline" size={14} color={colors.textMuted} />}
                        onPress={() => handleGraduateSidekick(sk)}
                        style={{ flex: 1 }}
                      />
                    )}
                  </View>
                </TacticalCard>
              );
            })}

            {/* Empty Slot / Candidate Recruitment (If < 2 Sidekicks) */}
            {sidekicks.length < user.mentorInfo.maxSidekicks && (
              <View style={{ marginTop: 4, marginBottom: 12 }}>
                <TacticalCard accent="purple" style={styles.candidateCard}>
                  <View style={styles.candidateHeader}>
                    <View style={[styles.emptySlotIcon, { borderColor: colors.purple }]}>
                      <Ionicons name="person-add" size={18} color={colors.purple} />
                    </View>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text variant="h3" color={colors.purple}>
                        SLOT 2 OPEN: RECRUIT APPRENTICE
                      </Text>
                      <Text variant="caption" color={colors.textSecondary}>
                        Candidate: {APPRENTICE_CANDIDATES[0].name} ({APPRENTICE_CANDIDATES[0].callsign}) • {APPRENTICE_CANDIDATES[0].specialty}
                      </Text>
                    </View>
                  </View>

                  <Button
                    title="+ ACCEPT AS APPRENTICE SIDEKICK"
                    variant="outline"
                    size="sm"
                    fullWidth
                    leftIcon={<Ionicons name="checkmark-circle-outline" size={16} color={colors.purple} />}
                    onPress={() => handleRecruitCandidate(APPRENTICE_CANDIDATES[0])}
                    style={{ marginTop: 10 }}
                  />
                </TacticalCard>
              </View>
            )}

            {/* Live Tactical Comms (Real-Time Technical Guidance Channel) */}
            <Divider label={`// 2. LIVE TACTICAL COMMS // ${currentSidekick?.callsign || 'SIDEKICK'}`} />

            <TacticalCard accent="cyan" style={styles.chatCard}>
              {/* Message List */}
              <View style={styles.chatList}>
                {filteredMessages.map((msg) => {
                  const isMentorMsg = msg.sender === 'mentor';
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageBubble,
                        isMentorMsg ? styles.mentorBubble : styles.sidekickBubble,
                        {
                          backgroundColor: isMentorMsg ? `${colors.primary}20` : colors.surfaceElevated,
                          borderColor: isMentorMsg ? colors.primary : colors.border,
                          alignSelf: isMentorMsg ? 'flex-end' : 'flex-start',
                        },
                      ]}
                    >
                      <Text
                        variant="caption"
                        weight="bold"
                        color={isMentorMsg ? colors.primary : colors.amber}
                        style={{ fontSize: 10, marginBottom: 2 }}
                      >
                        {isMentorMsg ? 'SPECTRE-07 (MENTOR)' : `${currentSidekick?.callsign} (SIDEKICK)`} • {msg.timestamp}
                      </Text>
                      <Text variant="bodySecondary" color={colors.textPrimary}>
                        {msg.text}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Quick Technical Guidance Presets */}
              <Text variant="caption" color={colors.textMuted} style={{ marginTop: 8, marginBottom: 4 }}>
                1-TAP TECHNICAL GUIDANCE PRESETS:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsRow}>
                {TECHNICAL_PRESETS.map((preset, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleSendMessage(preset)}
                    style={[
                      styles.presetChip,
                      { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                    ]}
                  >
                    <Text variant="caption" color={colors.textPrimary} style={{ fontSize: 11 }}>
                      {preset}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Chat Input Box */}
              <View style={[styles.chatInputRow, { borderTopColor: colors.border }]}>
                <TextInput
                  value={chatInput}
                  onChangeText={setChatInput}
                  placeholder="Ketik instruksi panduan teknis ke Sidekick..."
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surfaceElevated,
                      color: colors.textPrimary,
                      borderColor: colors.border,
                    },
                  ]}
                />
                <Button
                  title=""
                  variant="primary"
                  size="sm"
                  leftIcon={<Ionicons name="send" size={16} color={colors.textInverse} />}
                  onPress={() => handleSendMessage()}
                  style={styles.sendBtn}
                />
              </View>
            </TacticalCard>
          </ScrollView>
        </View>
      </View>

      {/* Live Video Feed Modal */}
      <TacticalVideoFeedModal
        visible={!!activeVideoSidekick}
        sidekick={activeVideoSidekick}
        onClose={() => setActiveVideoSidekick(null)}
      />
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
    height: '90%',
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentorIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  telemetryCard: {
    marginBottom: 12,
  },
  telemetryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  telemetryStatsRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  statCol: {
    flex: 1,
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  sidekickCard: {
    marginBottom: 10,
  },
  sidekickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidekickHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skAvatar: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionBox: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 8,
  },
  missionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  candidateCard: {
    padding: 12,
  },
  candidateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptySlotIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatCard: {
    marginTop: 6,
  },
  chatList: {
    gap: 8,
    marginBottom: 8,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  mentorBubble: {
    borderBottomRightRadius: 2,
  },
  sidekickBubble: {
    borderBottomLeftRadius: 2,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 13,
  },
  sendBtn: {
    height: 40,
    width: 44,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
