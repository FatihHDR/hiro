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
  SKILL_BRANCHES,
  SkillBranch,
  SkillNode,
} from '../../constants/skillTrees';
import {
  Text,
  TacticalCard,
  Button,
  Badge,
  BadgeColor,
  ProgressBar,
  Divider,
} from '../ui';

interface CareerSkillTreeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CareerSkillTreeModal: React.FC<CareerSkillTreeModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const { user, unlockSkillNode } = useAppState();

  const [selectedBranch, setSelectedBranch] = useState<SkillBranch>(SKILL_BRANCHES[0]);
  const [selectedNode, setSelectedNode] = useState<SkillNode>(SKILL_BRANCHES[0].nodes[0]);
  const [unlockSuccessMsg, setUnlockSuccessMsg] = useState<string>('');

  const isNodeUnlocked = (nodeId: string): boolean => {
    return user.unlockedSkillNodeIds.includes(nodeId);
  };

  const isNodeAvailable = (node: SkillNode): boolean => {
    if (isNodeUnlocked(node.id)) return false;
    if (user.level < node.levelRequired) return false;
    if (node.prerequisiteId && !isNodeUnlocked(node.prerequisiteId)) return false;
    return user.xp >= node.xpCost;
  };

  const getBranchUnlockedCount = (branch: SkillBranch): number => {
    return branch.nodes.filter((n) => isNodeUnlocked(n.id)).length;
  };

  const handleSelectBranch = (branch: SkillBranch) => {
    trigger('light');
    setSelectedBranch(branch);
    setSelectedNode(branch.nodes[0]);
    setUnlockSuccessMsg('');
  };

  const handleSelectNode = (node: SkillNode) => {
    trigger('selection');
    setSelectedNode(node);
    setUnlockSuccessMsg('');
  };

  const handleUnlockNode = (node: SkillNode) => {
    if (!isNodeAvailable(node)) return;

    const success = unlockSkillNode(node.id, node.xpCost, node.titleIndo);
    if (success) {
      trigger('success');
      setUnlockSuccessMsg(`🎉 SPESIALISASI DIBUKA: ${node.name.toUpperCase()} (+PERK DIAKTIFKAN)!`);
    } else {
      trigger('error');
    }
  };

  const branchUnlockedCount = getBranchUnlockedCount(selectedBranch);
  const branchMasteryPercent = Math.round((branchUnlockedCount / selectedBranch.nodes.length) * 100);

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
            { backgroundColor: 'rgba(8, 14, 23, 0.97)', borderColor: 'rgba(0, 229, 255, 0.4)' },
          ]}
        >
          {/* Top Light Ray Bar */}
          <View style={styles.topLightRay} />

          {/* Modal Header */}
          <View style={[styles.header, { borderBottomColor: 'rgba(255, 255, 255, 0.08)' }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.headerIconBox, { backgroundColor: `${colors.primary}20`, borderColor: colors.primary }]}>
                <Ionicons name="git-network" size={20} color={colors.primary} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text variant="h3" color={colors.primary} style={{ letterSpacing: 0.5 }}>
                  CAREER SKILL TREES
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  RPG PROGRESSION • XP GATEKEEPER & CERTIFICATIONS
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                trigger('light');
                onClose();
              }}
              style={({ pressed }) => [
                styles.closeBtn,
                { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Operator Telemetry HUD */}
            <TacticalCard accent="cyan" elevated style={styles.telemetryCard}>
              <View style={styles.telemetryTop}>
                <View>
                  <Text variant="caption" color={colors.textMuted}>OPERATOR LEVEL & STATUS</Text>
                  <Text variant="h3" color={colors.primary} style={{ fontSize: 16 }}>
                    {`LEVEL ${user.level} // ${user.rankTitle.toUpperCase()}`}
                  </Text>
                </View>
                <Badge
                  label={`${user.unlockedSkillNodeIds.length} SPECIALIZATIONS`}
                  color="emerald"
                  variant="status"
                />
              </View>

              <ProgressBar
                progress={user.xp / user.nextLevelXp}
                label="AVAILABLE OPERATOR XP RESERVE"
                valueText={`${user.xp.toLocaleString()} / ${user.nextLevelXp.toLocaleString()} XP`}
                color={colors.primary}
                height={7}
                style={{ marginTop: 10 }}
              />
            </TacticalCard>

            {/* Discipline Switcher Tabs */}
            <Divider label="// 1. SELECT CAREER DISCIPLINE" />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.branchTabsRow}>
              {SKILL_BRANCHES.map((b) => {
                const isActive = selectedBranch.id === b.id;
                const unlockedInBranch = getBranchUnlockedCount(b);
                const accentColor = colors[b.accent as keyof typeof colors];

                return (
                  <Pressable
                    key={b.id}
                    onPress={() => handleSelectBranch(b)}
                    style={({ pressed }) => [
                      styles.branchTab,
                      {
                        backgroundColor: isActive ? `${accentColor}22` : colors.surfaceElevated,
                        borderColor: isActive ? accentColor : colors.border,
                        shadowColor: isActive ? accentColor : 'transparent',
                      },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Ionicons
                      name={b.icon as any}
                      size={18}
                      color={isActive ? accentColor : colors.textMuted}
                    />
                    <View style={{ marginLeft: 8 }}>
                      <Text
                        variant="caption"
                        weight={isActive ? 'bold' : 'regular'}
                        color={isActive ? accentColor : colors.textPrimary}
                        style={{ fontSize: 11 }}
                      >
                        {b.name}
                      </Text>
                      <Text variant="caption" color={colors.textMuted} style={{ fontSize: 9.5 }}>
                        {unlockedInBranch}/{b.nodes.length} Mastered
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Branch Summary & Mastery Gauge */}
            <TacticalCard accent={selectedBranch.accent} style={styles.branchSummaryCard}>
              <View style={styles.branchSummaryTop}>
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight="bold" color={colors[selectedBranch.accent as keyof typeof colors]}>
                    {selectedBranch.name}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                    {selectedBranch.description}
                  </Text>
                </View>
                <View style={styles.masteryPill}>
                  <Text variant="mono" weight="bold" color={colors[selectedBranch.accent as keyof typeof colors]} style={{ fontSize: 14 }}>
                    {branchMasteryPercent}%
                  </Text>
                  <Text variant="caption" color={colors.textMuted} style={{ fontSize: 9 }}>
                    MASTERY
                  </Text>
                </View>
              </View>
            </TacticalCard>

            {/* Success Toast */}
            {unlockSuccessMsg ? (
              <View style={[styles.toastBox, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
                <Ionicons name="sparkles" size={18} color={colors.emerald} />
                <Text variant="caption" weight="bold" color={colors.emerald} style={{ marginLeft: 8, flex: 1 }}>
                  {unlockSuccessMsg}
                </Text>
              </View>
            ) : null}

            {/* Connected Progression Node Graph (Tier 1 ➔ Tier 2 ➔ Tier 3) */}
            <Divider label={`// 2. CONNECTED PROGRESSION TREE (${selectedBranch.nodes.length} TIERS)`} />

            <View style={styles.treeContainer}>
              {/* Central Glowing Circuit Spine Line */}
              <View style={[styles.circuitSpine, { borderColor: 'rgba(0, 229, 255, 0.25)' }]} />

              {selectedBranch.nodes.map((node, index) => {
                const unlocked = isNodeUnlocked(node.id);
                const available = isNodeAvailable(node);
                const isSelected = selectedNode.id === node.id;

                let statusBadgeColor: BadgeColor = 'muted';
                let statusLabel = `LOCKED // REQ LVL ${node.levelRequired}`;

                if (unlocked) {
                  statusBadgeColor = 'emerald';
                  statusLabel = 'ACTIVE // MASTERED';
                } else if (available) {
                  statusBadgeColor = 'amber';
                  statusLabel = `AVAILABLE TO UNLOCK (${node.xpCost} XP)`;
                }

                return (
                  <View key={node.id} style={styles.nodeWrapper}>
                    {/* Node Row Header & Connector Dot */}
                    <View style={styles.nodeSpineRow}>
                      <View
                        style={[
                          styles.spineNodeDot,
                          {
                            backgroundColor: unlocked ? colors.emerald : available ? colors.amber : colors.surfaceElevated,
                            borderColor: unlocked ? colors.emerald : available ? colors.amber : colors.border,
                          },
                        ]}
                      >
                        {unlocked ? (
                          <Ionicons name="checkmark" size={12} color="#000" />
                        ) : available ? (
                          <Ionicons name="lock-open" size={10} color="#000" />
                        ) : (
                          <Ionicons name="lock-closed" size={10} color={colors.textMuted} />
                        )}
                      </View>

                      <Text variant="mono" weight="bold" color={unlocked ? colors.emerald : available ? colors.amber : colors.textMuted} style={styles.tierTag}>
                        {`TIER 0${node.tier} // ${node.tier === 1 ? 'APPRENTICE BASELINE' : node.tier === 2 ? 'SPECIALIST OPERATOR' : 'MASTER ENGINEER'}`}
                      </Text>
                    </View>

                    {/* Node Interactive Card */}
                    <Pressable
                      onPress={() => handleSelectNode(node)}
                      style={({ pressed }) => [
                        styles.nodeCard,
                        {
                          backgroundColor: isSelected ? `${colors.surfaceElevated}FA` : `${colors.surface}F5`,
                          borderColor: isSelected
                            ? colors.primary
                            : unlocked
                            ? `${colors.emerald}70`
                            : available
                            ? `${colors.amber}70`
                            : 'rgba(255, 255, 255, 0.08)',
                          shadowColor: isSelected ? colors.primary : unlocked ? colors.emerald : 'transparent',
                          borderWidth: isSelected ? 2 : 1,
                        },
                        pressed && { transform: [{ scale: 0.985 }] },
                      ]}
                    >
                      {/* Top Ray Accent on Card */}
                      <View
                        style={[
                          styles.cardTopRay,
                          {
                            backgroundColor: isSelected
                              ? colors.primary
                              : unlocked
                              ? colors.emerald
                              : available
                              ? colors.amber
                              : 'transparent',
                          },
                        ]}
                      />

                      <View style={styles.nodeCardHeader}>
                        <View style={styles.nodeHeaderLeft}>
                          <View
                            style={[
                              styles.nodeIconBox,
                              {
                                backgroundColor: unlocked
                                  ? `${colors.emerald}20`
                                  : available
                                  ? `${colors.amber}20`
                                  : 'rgba(255, 255, 255, 0.05)',
                                borderColor: unlocked
                                  ? colors.emerald
                                  : available
                                  ? colors.amber
                                  : colors.border,
                              },
                            ]}
                          >
                            <Ionicons
                              name={node.icon as any}
                              size={20}
                              color={unlocked ? colors.emerald : available ? colors.amber : colors.textMuted}
                            />
                          </View>

                          <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text variant="h3" style={{ fontSize: 15 }}>
                              {node.name}
                            </Text>
                            <Text variant="caption" color={colors.textSecondary}>
                              {node.titleIndo}
                            </Text>
                          </View>
                        </View>

                        <Badge label={statusLabel} color={statusBadgeColor} variant="status" />
                      </View>

                      <Text variant="bodySecondary" color={colors.textPrimary} style={{ marginVertical: 8, fontSize: 12.5 }}>
                        {node.summary}
                      </Text>

                      {/* Tactical Perks Grid */}
                      <View style={[styles.perksBox, { backgroundColor: 'rgba(10, 16, 26, 0.7)', borderColor: 'rgba(255, 255, 255, 0.06)' }]}>
                        {node.tacticalPerks.map((perk, pIdx) => (
                          <View key={pIdx} style={styles.perkRow}>
                            <Ionicons
                              name="flash"
                              size={13}
                              color={unlocked ? colors.emerald : available ? colors.amber : colors.textMuted}
                            />
                            <Text
                              variant="caption"
                              color={unlocked ? colors.textPrimary : colors.textSecondary}
                              style={{ marginLeft: 6, flex: 1, fontSize: 11 }}
                            >
                              {perk}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Unlocked Corporate Contracts */}
                      <View style={styles.contractsUnlockedRow}>
                        <Ionicons name="briefcase-outline" size={13} color={colors.primary} />
                        <Text variant="caption" color={colors.textMuted} style={{ marginLeft: 6, flex: 1, fontSize: 10.5 }}>
                          Unlocked Contracts: <Text variant="caption" weight="bold" color={colors.primary}>{node.unlockedContracts.join(' • ')}</Text>
                        </Text>
                      </View>

                      {/* Action Button: Unlock or Certified Tag */}
                      <View style={[styles.nodeActionRow, { borderTopColor: 'rgba(255, 255, 255, 0.08)' }]}>
                        {unlocked ? (
                          <View style={styles.unlockedActiveBadge}>
                            <Ionicons name="shield-checkmark" size={16} color={colors.emerald} />
                            <Text variant="mono" weight="bold" color={colors.emerald} style={{ marginLeft: 6, fontSize: 11 }}>
                              ACTIVE SPECIALIZATION // PERKS APPLIED
                            </Text>
                          </View>
                        ) : available ? (
                          <Button
                            title={`⚡ UNLOCK SPECIALIZATION (-${node.xpCost} XP)`}
                            variant="primary"
                            size="md"
                            fullWidth
                            leftIcon={<Ionicons name="sparkles" size={16} color={colors.textInverse} />}
                            onPress={() => handleUnlockNode(node)}
                          />
                        ) : (
                          <View style={styles.lockedRequirementRow}>
                            <Ionicons name="lock-closed" size={14} color={colors.crimson} />
                            <Text variant="caption" color={colors.crimson} style={{ marginLeft: 6 }}>
                              {node.prerequisiteId && !isNodeUnlocked(node.prerequisiteId)
                                ? `Requires Tier ${node.tier - 1} Specialization Unlocked First`
                                : `Requires Operator Level ${node.levelRequired} (Current: Lvl ${user.level})`}
                            </Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
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
    height: '92%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  topLightRay: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: 'rgba(0, 229, 255, 0.6)',
    zIndex: 10,
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
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  telemetryCard: {
    marginBottom: 8,
  },
  telemetryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  branchTabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  branchTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  branchSummaryCard: {
    marginBottom: 10,
  },
  branchSummaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  masteryPill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 10,
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  treeContainer: {
    position: 'relative',
    marginTop: 6,
  },
  circuitSpine: {
    position: 'absolute',
    left: 11,
    top: 15,
    bottom: 20,
    width: 2,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    zIndex: 1,
  },
  nodeWrapper: {
    position: 'relative',
    marginBottom: 16,
    zIndex: 2,
  },
  nodeSpineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  spineNodeDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  tierTag: {
    marginLeft: 10,
    fontSize: 10.5,
    letterSpacing: 0.6,
  },
  nodeCard: {
    borderRadius: 10,
    padding: 12,
    marginLeft: 12,
    position: 'relative',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTopRay: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 1.5,
  },
  nodeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  nodeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perksBox: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
    marginBottom: 8,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contractsUnlockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nodeActionRow: {
    borderTopWidth: 1,
    paddingTop: 8,
  },
  unlockedActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  lockedRequirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
});
