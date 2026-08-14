import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
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
  ProgressBar,
  Divider,
} from '../ui';

interface CareerSkillTreeModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_WIDTH = Math.min(SCREEN_WIDTH - 40, 380);
const CANVAS_HEIGHT = 380;

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
      setUnlockSuccessMsg(`🎉 BERHASIL MEMBUKA: ${node.name.toUpperCase()} (+PERKS DIAKTIFKAN)!`);
    } else {
      trigger('error');
    }
  };

  const branchUnlockedCount = getBranchUnlockedCount(selectedBranch);
  const branchMasteryPercent = Math.round((branchUnlockedCount / selectedBranch.nodes.length) * 100);
  const branchAccentColor = colors[selectedBranch.accent as keyof typeof colors] || colors.primary;

  // Helper to convert % to canvas pixel coordinates
  const getCanvasCoord = (pctX: number, pctY: number) => {
    return {
      x: (pctX / 100) * CANVAS_WIDTH,
      y: (pctY / 100) * CANVAS_HEIGHT,
    };
  };

  // Branch connections
  const coreNode = selectedBranch.nodes.find((n) => n.branchPath === 'core') || selectedBranch.nodes[0];
  const node2a = selectedBranch.nodes.find((n) => n.id === `${selectedBranch.id}_2a`);
  const node3a = selectedBranch.nodes.find((n) => n.id === `${selectedBranch.id}_3a`);
  const node2b = selectedBranch.nodes.find((n) => n.id === `${selectedBranch.id}_2b`);
  const node3b = selectedBranch.nodes.find((n) => n.id === `${selectedBranch.id}_3b`);

  const connections = [
    { from: coreNode, to: node2a },
    { from: coreNode, to: node2b },
    { from: node2a, to: node3a },
    { from: node2b, to: node3b },
  ].filter((c) => c.from && c.to) as { from: SkillNode; to: SkillNode }[];

  const isSelectedNodeUnlocked = isNodeUnlocked(selectedNode.id);
  const isSelectedNodeAvailable = isNodeAvailable(selectedNode);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: 'rgba(0, 0, 0, 0.75)' }]}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.background,
              borderColor: `${branchAccentColor}60`,
            },
          ]}
        >
          {/* Top Light Ray synced with branch accent */}
          <View style={[styles.topLightRay, { backgroundColor: branchAccentColor }]} />

          {/* Modal Header */}
          <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.headerIconBox, { backgroundColor: `${branchAccentColor}20`, borderColor: branchAccentColor }]}>
                <Ionicons name="git-branch" size={20} color={branchAccentColor} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text variant="h3" color={branchAccentColor} style={{ letterSpacing: 0.5 }}>
                  BRANCHING SKILL MATRIX
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  RPG CONNECTED NODE TREE & SPECIALIZATIONS
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
            {/* Operator Telemetry Bar */}
            <TacticalCard accent={selectedBranch.accent} elevated style={styles.telemetryCard}>
              <View style={styles.telemetryTop}>
                <View>
                  <Text variant="caption" color={colors.textMuted}>OPERATOR LEVEL & MASTERY</Text>
                  <Text variant="h3" color={branchAccentColor} style={{ fontSize: 16 }}>
                    {`LEVEL ${user.level} // ${user.rankTitle.toUpperCase()}`}
                  </Text>
                </View>
                <Badge
                  label={`${branchMasteryPercent}% ${selectedBranch.name.split(' ')[0]} MASTERY`}
                  color={selectedBranch.accent}
                  variant="status"
                />
              </View>

              <ProgressBar
                progress={user.xp / user.nextLevelXp}
                label="OPERATOR EXP RESERVE"
                valueText={`${user.xp.toLocaleString()} / ${user.nextLevelXp.toLocaleString()} XP`}
                color={branchAccentColor}
                height={7}
                style={{ marginTop: 10 }}
              />
            </TacticalCard>

            {/* Discipline Switcher Tabs */}
            <Divider label="// 1. SELECT CAREER TREE BRANCH" />

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
                        backgroundColor: isActive ? `${accentColor}25` : colors.surface,
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
                        {unlockedInBranch}/{b.nodes.length} Nodes Mastered ({Math.round((unlockedInBranch / b.nodes.length) * 100)}%)
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Toast Notification */}
            {unlockSuccessMsg ? (
              <View style={[styles.toastBox, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
                <Ionicons name="sparkles" size={18} color={colors.emerald} />
                <Text variant="caption" weight="bold" color={colors.emerald} style={{ marginLeft: 8, flex: 1 }}>
                  {unlockSuccessMsg}
                </Text>
              </View>
            ) : null}

            {/* =========================================================================
                VISUAL RPG BRANCHING TREE CANVAS WITH SVG CONNECTOR LINES & ORB NODES
                ========================================================================= */}
            <Divider label={`// 2. ${selectedBranch.name} // VISUAL NODE GRAPH`} />

            <View style={styles.treeCanvasContainer}>
              {/* Path Category Badges on Left & Right */}
              <View style={styles.pathHeaderRow}>
                <View style={[styles.pathTag, { backgroundColor: colors.surface, borderColor: `${branchAccentColor}50` }]}>
                  <Text variant="mono" weight="bold" color={branchAccentColor} style={{ fontSize: 9 }}>
                    ⮜ PATH A: HEAVY COMMERCIAL
                  </Text>
                </View>
                <View style={[styles.pathTag, { backgroundColor: colors.surface, borderColor: `${colors.amber}50` }]}>
                  <Text variant="mono" weight="bold" color={colors.amber} style={{ fontSize: 9 }}>
                    PATH B: SMART AUTOMATION ⮞
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.canvasBox,
                  {
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT,
                    backgroundColor: colors.surface,
                    borderColor: `${branchAccentColor}35`,
                  },
                ]}
              >
                {/* SVG Branch Lines Layer */}
                <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={StyleSheet.absoluteFillObject}>
                  {connections.map((conn, idx) => {
                    const fromCoord = getCanvasCoord(conn.from.gridX, conn.from.gridY);
                    const toCoord = getCanvasCoord(conn.to.gridX, conn.to.gridY);

                    const isFromUnlocked = isNodeUnlocked(conn.from.id);
                    const isToUnlocked = isNodeUnlocked(conn.to.id);
                    const isToAvailable = isNodeAvailable(conn.to);

                    let strokeColor = `${colors.border}60`;
                    let strokeWidth = 2;
                    let strokeDasharray: string | undefined = '4, 4';

                    if (isFromUnlocked && isToUnlocked) {
                      strokeColor = colors.emerald;
                      strokeWidth = 3.5;
                      strokeDasharray = undefined;
                    } else if (isFromUnlocked && isToAvailable) {
                      strokeColor = colors.amber;
                      strokeWidth = 2.5;
                      strokeDasharray = '6, 3';
                    }

                    return (
                      <React.Fragment key={idx}>
                        <Line
                          x1={fromCoord.x}
                          y1={fromCoord.y}
                          x2={toCoord.x}
                          y2={toCoord.y}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                        />
                        {/* Midpoint glowing node bead */}
                        {isFromUnlocked && isToUnlocked && (
                          <Circle
                            cx={(fromCoord.x + toCoord.x) / 2}
                            cy={(fromCoord.y + toCoord.y) / 2}
                            r={3.5}
                            fill={colors.emerald}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </Svg>

                {/* Interactive Node Orb Pins */}
                {selectedBranch.nodes.map((node) => {
                  const unlocked = isNodeUnlocked(node.id);
                  const available = isNodeAvailable(node);
                  const isSelected = selectedNode.id === node.id;
                  const coord = getCanvasCoord(node.gridX, node.gridY);

                  let orbBorderColor = colors.border;
                  let orbBgColor = colors.surfaceElevated;
                  let glowShadowColor = 'transparent';

                  if (isSelected) {
                    orbBorderColor = branchAccentColor;
                    orbBgColor = `${branchAccentColor}30`;
                    glowShadowColor = branchAccentColor;
                  } else if (unlocked) {
                    orbBorderColor = colors.emerald;
                    orbBgColor = `${colors.emerald}25`;
                    glowShadowColor = colors.emerald;
                  } else if (available) {
                    orbBorderColor = colors.amber;
                    orbBgColor = `${colors.amber}25`;
                    glowShadowColor = colors.amber;
                  }

                  return (
                    <Pressable
                      key={node.id}
                      onPress={() => handleSelectNode(node)}
                      style={[
                        styles.nodeOrbWrapper,
                        {
                          left: coord.x - 28,
                          top: coord.y - 28,
                        },
                      ]}
                    >
                      {/* Orb Circle */}
                      <View
                        style={[
                          styles.nodeOrb,
                          {
                            borderColor: orbBorderColor,
                            backgroundColor: orbBgColor,
                            shadowColor: glowShadowColor,
                            borderWidth: isSelected ? 2.5 : unlocked || available ? 2 : 1.5,
                            transform: [{ scale: isSelected ? 1.15 : 1 }],
                          },
                        ]}
                      >
                        <Ionicons
                          name={node.icon as any}
                          size={22}
                          color={
                            unlocked
                              ? colors.emerald
                              : available
                              ? colors.amber
                              : isSelected
                              ? branchAccentColor
                              : colors.textMuted
                          }
                        />

                        {/* Status Mini Icon Badge */}
                        <View
                          style={[
                            styles.orbStatusBadge,
                            {
                              backgroundColor: unlocked
                                ? colors.emerald
                                : available
                                ? colors.amber
                                : colors.surfaceElevated,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          {unlocked ? (
                            <Ionicons name="checkmark" size={9} color="#000" />
                          ) : available ? (
                            <Ionicons name="lock-open" size={8} color="#000" />
                          ) : (
                            <Ionicons name="lock-closed" size={8} color={colors.textMuted} />
                          )}
                        </View>
                      </View>

                      {/* Node Label Pill below orb */}
                      <View
                        style={[
                          styles.nodeOrbLabelPill,
                          {
                            backgroundColor: isSelected ? `${branchAccentColor}25` : colors.surface,
                            borderColor: isSelected ? branchAccentColor : colors.border,
                          },
                        ]}
                      >
                        <Text
                          variant="mono"
                          weight={isSelected ? 'bold' : 'semibold'}
                          color={
                            isSelected
                              ? branchAccentColor
                              : unlocked
                              ? colors.emerald
                              : available
                              ? colors.amber
                              : colors.textMuted
                          }
                          numberOfLines={1}
                          style={styles.orbLabelText}
                        >
                          {`T${node.tier} // ${node.titleIndo.slice(0, 14)}`}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* =========================================================================
                INSPECTED NODE TELEMETRY & PERK UNLOCK DRAWER
                ========================================================================= */}
            <Divider label={`// 3. INSPECTION: ${selectedNode.name.toUpperCase()}`} />

            <TacticalCard
              accent={isSelectedNodeUnlocked ? 'emerald' : isSelectedNodeAvailable ? 'amber' : selectedBranch.accent}
              elevated
              style={styles.inspectionCard}
            >
              {/* Inspection Header */}
              <View style={styles.inspectHeader}>
                <View style={styles.inspectHeaderLeft}>
                  <View
                    style={[
                      styles.inspectIconBox,
                      {
                        backgroundColor: isSelectedNodeUnlocked
                          ? `${colors.emerald}20`
                          : isSelectedNodeAvailable
                          ? `${colors.amber}20`
                          : `${branchAccentColor}20`,
                        borderColor: isSelectedNodeUnlocked
                          ? colors.emerald
                          : isSelectedNodeAvailable
                          ? colors.amber
                          : branchAccentColor,
                      },
                    ]}
                  >
                    <Ionicons
                      name={selectedNode.icon as any}
                      size={22}
                      color={
                        isSelectedNodeUnlocked
                          ? colors.emerald
                          : isSelectedNodeAvailable
                          ? colors.amber
                          : branchAccentColor
                      }
                    />
                  </View>

                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text variant="h3" style={{ fontSize: 16 }}>
                      {selectedNode.name}
                    </Text>
                    <Text variant="caption" color={colors.textSecondary}>
                      {selectedNode.titleIndo}
                    </Text>
                  </View>
                </View>

                <Badge
                  label={
                    isSelectedNodeUnlocked
                      ? 'MASTERED // ACTIVE'
                      : isSelectedNodeAvailable
                      ? `UNLOCK (${selectedNode.xpCost} XP)`
                      : `REQ LEVEL ${selectedNode.levelRequired}`
                  }
                  color={
                    isSelectedNodeUnlocked
                      ? 'emerald'
                      : isSelectedNodeAvailable
                      ? 'amber'
                      : 'muted'
                  }
                  variant="status"
                />
              </View>

              <Text variant="bodySecondary" color={colors.textPrimary} style={{ marginVertical: 8 }}>
                {selectedNode.summary}
              </Text>

              {/* Tactical RPG Perks Box */}
              <View style={[styles.inspectPerksBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                <Text variant="caption" weight="bold" color={colors.textMuted} style={{ marginBottom: 4 }}>
                  TACTICAL PERKS & STAT BUFFS:
                </Text>
                {selectedNode.tacticalPerks.map((perk, idx) => (
                  <View key={idx} style={styles.inspectPerkRow}>
                    <Ionicons
                      name="flash"
                      size={14}
                      color={isSelectedNodeUnlocked ? colors.emerald : isSelectedNodeAvailable ? colors.amber : branchAccentColor}
                    />
                    <Text
                      variant="caption"
                      color={isSelectedNodeUnlocked ? colors.textPrimary : colors.textSecondary}
                      style={{ marginLeft: 6, flex: 1, fontSize: 11.5 }}
                    >
                      {perk}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Unlocked Corporate Contracts */}
              <View style={styles.contractsRow}>
                <Ionicons name="briefcase-outline" size={14} color={branchAccentColor} />
                <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 6, flex: 1, fontSize: 11 }}>
                  Unlocked Contracts: <Text variant="caption" weight="bold" color={branchAccentColor}>{selectedNode.unlockedContracts.join(' • ')}</Text>
                </Text>
              </View>

              {/* Action Button: Unlock or Active Badge */}
              <View style={[styles.inspectActionRow, { borderTopColor: colors.border }]}>
                {isSelectedNodeUnlocked ? (
                  <View style={[styles.activeCertifiedBanner, { backgroundColor: `${colors.emerald}15`, borderColor: colors.emerald }]}>
                    <Ionicons name="shield-checkmark" size={18} color={colors.emerald} />
                    <Text variant="mono" weight="bold" color={colors.emerald} style={{ marginLeft: 8, fontSize: 12 }}>
                      SPECIALIZATION ACTIVE // PERKS APPLIED
                    </Text>
                  </View>
                ) : isSelectedNodeAvailable ? (
                  <Button
                    title={`⚡ UNLOCK SPECIALIZATION (-${selectedNode.xpCost} XP)`}
                    variant="primary"
                    size="md"
                    fullWidth
                    leftIcon={<Ionicons name="sparkles" size={18} color={colors.textInverse} />}
                    onPress={() => handleUnlockNode(selectedNode)}
                  />
                ) : (
                  <View style={[styles.lockedWarningBox, { borderColor: colors.crimson, backgroundColor: `${colors.crimson}15` }]}>
                    <Ionicons name="lock-closed" size={16} color={colors.crimson} />
                    <Text variant="caption" color={colors.crimson} style={{ marginLeft: 8, flex: 1 }}>
                      {selectedNode.prerequisiteId && !isNodeUnlocked(selectedNode.prerequisiteId)
                        ? `Prerequisite Required: Unlock Tier ${selectedNode.tier - 1} node first.`
                        : `Required Operator Level ${selectedNode.levelRequired} (You are Level ${user.level}).`}
                    </Text>
                  </View>
                )}
              </View>
            </TacticalCard>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '94%',
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
    height: 2.5,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    paddingTop: 12,
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
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  treeCanvasContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  pathHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CANVAS_WIDTH,
    marginBottom: 6,
  },
  pathTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  canvasBox: {
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  nodeOrbWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    zIndex: 10,
  },
  nodeOrb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  orbStatusBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeOrbLabelPill: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbLabelText: {
    fontSize: 8.5,
    textAlign: 'center',
  },
  inspectionCard: {
    marginTop: 8,
  },
  inspectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inspectHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  inspectIconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspectPerksBox: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
    marginBottom: 8,
  },
  inspectPerkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contractsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  inspectActionRow: {
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  activeCertifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  lockedWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
});
