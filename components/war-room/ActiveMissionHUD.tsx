import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useAppState } from '../../context/AppStateContext';
import {
  Text,
  TacticalCard,
  Badge,
  Button,
} from '../ui';

export interface ActiveMissionDetail {
  id: string;
  title: string;
  category: string;
  location: string;
  citizenName: string;
  rewardIdr: string;
  rewardCoins: number;
  xpReward: number;
  distance: string;
  etaMinutes: number;
}

interface ActiveMissionHUDProps {
  mission: ActiveMissionDetail;
  onOpenRouteOptimizer: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

export const ActiveMissionHUD: React.FC<ActiveMissionHUDProps> = ({
  mission,
  onOpenRouteOptimizer,
  onComplete,
  onCancel,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const { addXp, addCoins, releaseEscrow } = useAppState();

  const [secondsRemaining, setSecondsRemaining] = useState(mission.etaMinutes * 60);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCompleteMission = () => {
    trigger('success');
    setIsFinishing(true);

    // Reward the Hero with XP and Coins
    addXp(mission.xpReward);
    addCoins(mission.rewardCoins);

    const cleanReward = parseInt(mission.rewardIdr.replace(/[^0-9]/g, ''), 10) || 500000;
    releaseEscrow(cleanReward);

    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <TacticalCard accent="emerald" elevated style={styles.container}>
      {/* HUD Header Status */}
      <View style={styles.hudHeader}>
        <View style={styles.liveBeaconRow}>
          <View style={[styles.pulsingDot, { backgroundColor: colors.emerald }]} />
          <Text variant="mono" weight="bold" color={colors.emerald} style={{ fontSize: 11 }}>
            DISPATCH IN PROGRESS // ACTIVE CONTRACT
          </Text>
        </View>
        <Badge label={`ETA ${formatTimer(secondsRemaining)}`} color="emerald" variant="status" />
      </View>

      {/* Mission Title & Location */}
      <Text variant="h3" style={styles.missionTitle}>
        {mission.title}
      </Text>

      <View style={styles.infoRow}>
        <Ionicons name="location" size={14} color={colors.primary} />
        <Text variant="bodySecondary" color={colors.textSecondary} style={{ marginLeft: 4, flex: 1 }}>
          {mission.location} ({mission.distance})
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
        <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
          Citizen Client: <Text variant="caption" weight="bold">{mission.citizenName}</Text>
        </Text>
      </View>

      {/* Traffic Avoidance Route Banner */}
      <Pressable
        onPress={() => {
          trigger('light');
          onOpenRouteOptimizer();
        }}
        style={[
          styles.routeBypassBar,
          { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
        ]}
      >
        <Ionicons name="navigate-circle" size={18} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text variant="caption" weight="bold" color={colors.primary}>
            TACTICAL ROUTE: CONGESTION BYPASS ACTIVE
          </Text>
          <Text variant="caption" color={colors.textMuted} style={{ fontSize: 10 }}>
            Tap to view turn-by-turn waypoint bypass directions (-12 mins saved)
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </Pressable>

      {/* Reward Telemetry */}
      <View style={[styles.rewardRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
        <View style={styles.rewardCol}>
          <Text variant="caption" color={colors.textMuted}>ESCROW PAYOUT</Text>
          <Text variant="mono" weight="bold" color={colors.emerald}>{mission.rewardIdr}</Text>
        </View>
        <View style={styles.rewardCol}>
          <Text variant="caption" color={colors.textMuted}>HERO COINS</Text>
          <Text variant="mono" weight="bold" color={colors.amber}>+{mission.rewardCoins} HC</Text>
        </View>
        <View style={styles.rewardCol}>
          <Text variant="caption" color={colors.textMuted}>EXP REWARD</Text>
          <Text variant="mono" weight="bold" color={colors.primary}>+{mission.xpReward} XP</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <Button
          title={isFinishing ? "FINALIZING REWARDS..." : "COMPLETE MISSION & CLAIM REWARDS"}
          variant="primary"
          size="md"
          fullWidth
          leftIcon={<Ionicons name="checkmark-done-circle" size={18} color={colors.textInverse} />}
          onPress={handleCompleteMission}
          disabled={isFinishing}
          style={{ marginBottom: 6 }}
        />
        <Button
          title="ABORT / CANCEL CONTRACT"
          variant="ghost"
          size="sm"
          fullWidth
          onPress={onCancel}
        />
      </View>
    </TacticalCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  hudHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  liveBeaconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  missionTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeBypassBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginVertical: 10,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  rewardCol: {
    alignItems: 'center',
  },
  actionRow: {
    marginTop: 4,
  },
});
