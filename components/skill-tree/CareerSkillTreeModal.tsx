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
      setUnlockSuccessMsg(`🎉 BERHASIL MEMBUKA SPESIALISASI: ${node.name.toUpperCase()}!`);
    } else {
      trigger('error');
    }
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
              <Ionicons name="git-network" size={20} color={colors.primary} />
              <View style={{ marginLeft: 8 }}>
                <Text variant="h3" color={colors.primary}>
                  CAREER SKILL TREES & SPECIALIZATION
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  RPG Career Progression • XP & Rank Gatekeeper
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
            {/* Operator Telemetry Bar */}
            <TacticalCard accent="cyan" style={styles.telemetryCard}>
              <View style={styles.telemetryTop}>
                <View>
                  <Text variant="caption" color={colors.textMuted}>OPERATOR RANK & LEVEL</Text>
                  <Text variant="h3" color={colors.primary}>
                    {`LEVEL ${user.level} // ${user.rankTitle.toUpperCase()}`}
                  </Text>
                </View>
                <Badge
                  label={`${user.unlockedSkillNodeIds.length} SPECIALIZATIONS ACTIVE`}
                  color="emerald"
                  variant="status"
                />
              </View>

              <ProgressBar
                progress={user.xp / user.nextLevelXp}
                label="AVAILABLE OPERATOR EXP RESERVE"
                valueText={`${user.xp.toLocaleString()} XP (Next Level: ${user.nextLevelXp.toLocaleString()} XP)`}
                color={colors.primary}
                height={6}
                style={{ marginTop: 10 }}
              />
            </TacticalCard>

            {/* Specialization Branch Tabs */}
            <Divider label="// 1. SELECT CAREER DISCIPLINE" />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.branchTabsRow}>
              {SKILL_BRANCHES.map((b) => {
                const isActive = selectedBranch.id === b.id;
                return (
                  <Pressable
                    key={b.id}
                    onPress={() => {
                      trigger('light');
                      setSelectedBranch(b);
                      setSelectedNode(b.nodes[0]);
                      setUnlockSuccessMsg('');
                    }}
                    style={[
                      styles.branchTab,
                      {
                        backgroundColor: isActive ? `${colors[b.accent as keyof typeof colors]}20` : colors.surfaceElevated,
                        borderColor: isActive ? colors[b.accent as keyof typeof colors] : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={b.icon as any}
                      size={18}
                      color={isActive ? colors[b.accent as keyof typeof colors] : colors.textMuted}
                    />
                    <Text
                      variant="caption"
                      weight={isActive ? 'bold' : 'regular'}
                      color={isActive ? colors[b.accent as keyof typeof colors] : colors.textPrimary}
                      style={{ marginLeft: 6, fontSize: 11 }}
                    >
                      {b.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text variant="caption" color={colors.textSecondary} style={styles.branchSubtitle}>
              {selectedBranch.subtitle}
            </Text>

            {/* Visual RPG Progression Nodes (Tier 1 ➔ Tier 2 ➔ Tier 3) */}
            <Divider label={`// 2. ${selectedBranch.name} PROGRESSION TREE`} />

            <View style={styles.treeContainer}>
              {selectedBranch.nodes.map((node, index) => {
                const unlocked = isNodeUnlocked(node.id);
                const available = isNodeAvailable(node);
                const isSelected = selectedNode.id === node.id;

                let statusBadgeColor: BadgeColor = 'muted';
                let statusLabel = `LOCKED (LVL ${node.levelRequired})`;

                if (unlocked) {
                  statusBadgeColor = 'emerald';
                  statusLabel = 'ACTIVE // UNLOCKED';
                } else if (available) {
                  statusBadgeColor = 'amber';
                  statusLabel = `READY TO UNLOCK (${node.xpCost} XP)`;
                }

                return (
                  <View key={node.id} style={styles.nodeWrapper}>
                    {/* Connecting Line from Previous Node */}
                    {index > 0 && (
                      <View
                        style={[
                          styles.connectingLine,
                          {
                            backgroundColor: unlocked
                              ? colors.emerald
                              : isNodeUnlocked(selectedBranch.nodes[index - 1].id)
                              ? colors.amber
                              : colors.border,
                          },
                        ]}
                      />
                    )}

                    {/* Node Card */}
                    <Pressable
                      onPress={() => handleSelectNode(node)}
                      style={[
                        styles.nodeCard,
                        {
                          backgroundColor: isSelected
                            ? colors.surfaceElevated
                            : colors.surface,
                          borderColor: isSelected
                            ? colors.primary
                            : unlocked
                            ? colors.emerald
                            : available
                            ? colors.amber
                            : colors.border,
                          borderWidth: isSelected ? 2 : 1,
                        },
                      ]}
                    >
                      <View style={styles.nodeTopRow}>
                        <View style={styles.tierPill}>
                          <Text variant="mono" weight="bold" color={colors.primary} style={{ fontSize: 10 }}>
                            TIER {node.tier}
                          </Text>
                        </View>

                        <Badge
                          label={statusLabel}
                          color={statusBadgeColor}
                          variant="status"
                        />
                      </View>

                      <View style={styles.nodeMainRow}>
                        <View
                          style={[
                            styles.nodeIconBox,
                            {
                              backgroundColor: unlocked ? `${colors.emerald}20` : `${colors.primary}15`,
                              borderColor: unlocked ? colors.emerald : colors.border,
                            },
                          ]}
                        >
                          <Ionicons
                            name={node.icon as any}
                            size={22}
                            color={unlocked ? colors.emerald : colors.primary}
                          />
                        </View>

                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text variant="body" weight="bold" color={colors.textPrimary}>
                            {node.titleIndo}
                          </Text>
                          <Text variant="caption" color={colors.textMuted}>
                            {node.name}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            {/* Selected Node Detailed Inspector */}
            {selectedNode && (
              <TacticalCard
                accent={isNodeUnlocked(selectedNode.id) ? 'emerald' : isNodeAvailable(selectedNode) ? 'amber' : 'cyan'}
                elevated
                style={styles.inspectorCard}
              >
                <View style={styles.inspectorHeader}>
                  <Text variant="caption" color={colors.textMuted}>
                    SPECIALIZATION DOSSIER // TIER {selectedNode.tier}
                  </Text>
                  {isNodeUnlocked(selectedNode.id) && (
                    <Badge label="CERTIFIED SPECIALIST" color="emerald" variant="status" />
                  )}
                </View>

                <Text variant="h3" style={{ marginVertical: 4 }}>
                  {selectedNode.titleIndo}
                </Text>
                <Text variant="bodySecondary" color={colors.textSecondary}>
                  {selectedNode.summary}
                </Text>

                {/* Tactical Perks */}
                <View style={[styles.perksContainer, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                  <Text variant="caption" weight="bold" color={colors.primary} style={{ marginBottom: 6 }}>
                    TACTICAL OPERATOR PERKS:
                  </Text>
                  {selectedNode.tacticalPerks.map((perk, i) => (
                    <View key={i} style={styles.perkBullet}>
                      <Ionicons name="checkmark-circle" size={14} color={colors.emerald} />
                      <Text variant="caption" color={colors.textPrimary} style={{ marginLeft: 6 }}>
                        {perk}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Unlocked Corporate Contracts */}
                <View style={styles.contractsSection}>
                  <Text variant="caption" weight="bold" color={colors.amber} style={{ marginBottom: 6 }}>
                    UNLOCKED HIGH-VALUE CORPORATE CONTRACTS:
                  </Text>
                  {selectedNode.unlockedContracts.map((c, i) => (
                    <View key={i} style={styles.contractItem}>
                      <Ionicons name="business" size={14} color={colors.amber} />
                      <Text variant="caption" color={colors.textPrimary} style={{ marginLeft: 6 }}>
                        {c}
                      </Text>
                    </View>
                  ))}
                </View>

                {unlockSuccessMsg ? (
                  <View style={[styles.successBanner, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.emerald} />
                    <Text variant="caption" weight="bold" color={colors.emerald} style={{ marginLeft: 6 }}>
                      {unlockSuccessMsg}
                    </Text>
                  </View>
                ) : null}

                {/* Unlock CTA */}
                <View style={styles.unlockActionSection}>
                  {isNodeUnlocked(selectedNode.id) ? (
                    <View style={[styles.unlockedTag, { backgroundColor: `${colors.emerald}15`, borderColor: colors.emerald }]}>
                      <Ionicons name="shield-checkmark" size={18} color={colors.emerald} />
                      <Text variant="mono" weight="bold" color={colors.emerald} style={{ marginLeft: 8 }}>
                        SPECIALIZATION ACTIVE & VALIDATED
                      </Text>
                    </View>
                  ) : (
                    <Button
                      title={
                        isNodeAvailable(selectedNode)
                          ? `UNLOCK SPECIALIZATION (-${selectedNode.xpCost} XP)`
                          : user.xp < selectedNode.xpCost
                          ? `INSUFFICIENT XP (Requires ${selectedNode.xpCost} XP)`
                          : `LOCKED // Requires Level ${selectedNode.levelRequired} & Previous Tier`
                      }
                      variant={isNodeAvailable(selectedNode) ? 'primary' : 'outline'}
                      size="md"
                      fullWidth
                      leftIcon={<Ionicons name={isNodeAvailable(selectedNode) ? "flash" : "lock-closed"} size={16} color={isNodeAvailable(selectedNode) ? colors.textInverse : colors.textMuted} />}
                      onPress={() => handleUnlockNode(selectedNode)}
                      disabled={!isNodeAvailable(selectedNode)}
                    />
                  )}
                </View>
              </TacticalCard>
            )}
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
  branchTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  branchTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  branchSubtitle: {
    fontStyle: 'italic',
    marginBottom: 12,
  },
  treeContainer: {
    marginVertical: 8,
  },
  nodeWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  connectingLine: {
    width: 3,
    height: 24,
    marginVertical: -2,
    zIndex: 1,
  },
  nodeCard: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
    zIndex: 2,
  },
  nodeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tierPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  nodeMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nodeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspectorCard: {
    marginTop: 16,
  },
  inspectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  perksContainer: {
    paddingVertical: 10,
    marginVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  perkBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contractsSection: {
    marginBottom: 12,
  },
  contractItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  unlockActionSection: {
    marginTop: 4,
  },
  unlockedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
});
