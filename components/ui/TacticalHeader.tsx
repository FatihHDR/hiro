import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadii, Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useAppState } from '../../context/AppStateContext';
import { useHaptics } from '../../hooks/useHaptics';
import { Text } from './Text';
import { SegmentedControl } from './SegmentedControl';
import { Avatar } from './Avatar';

export interface EnterpriseTacticalHeaderProps {
  title?: string;
  showRoleSwitcher?: boolean;
}

export const TacticalHeader: React.FC<EnterpriseTacticalHeaderProps> = ({
  title,
  showRoleSwitcher = true,
}) => {
  const { colors, toggleTheme, isDark } = useTheme();
  const { user, role, switchRole } = useAppState();
  const { trigger } = useHaptics();

  const handleToggleTheme = () => {
    trigger('light');
    toggleTheme();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftProfile}>
          <Avatar
            name={user.name}
            level={user.role === 'hero' ? user.level : undefined}
            isVerified={user.verificationStatus === 'verified' || user.verificationStatus === 'elite'}
            size="md"
          />
          <View style={styles.profileText}>
            <View style={styles.callsignRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.emerald }]} />
              <Text variant="mono" weight="bold" style={styles.callsign}>
                {user.callsign}
              </Text>
            </View>
            <Text variant="caption" color={colors.textSecondary}>
              {user.role === 'hero' ? user.rankTitle : 'Citizen Client'}
            </Text>
          </View>
        </View>

        <View style={styles.rightActions}>
          <Pressable
            onPress={handleToggleTheme}
            style={({ pressed }) => [
              styles.iconBtn,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={colors.primary}
            />
          </Pressable>
        </View>
      </View>

      {showRoleSwitcher && (
        <View style={styles.switcherRow}>
          <SegmentedControl
            options={[
              {
                value: 'citizen',
                label: 'Citizen View',
                icon: <Ionicons name="person-outline" size={14} color={role === 'citizen' ? colors.primary : colors.textSecondary} />,
              },
              {
                value: 'hero',
                label: 'Hero War Room',
                icon: <Ionicons name="shield-checkmark-outline" size={14} color={role === 'hero' ? colors.primary : colors.textSecondary} />,
              },
            ]}
            selectedValue={role}
            onSelect={switchRole}
          />
        </View>
      )}

      {/* Telemetry Bar */}
      <View style={[styles.telemetryBar, { backgroundColor: colors.background }]}>
        <View style={styles.telemetryItem}>
          <Ionicons name="pulse" size={12} color={colors.primary} />
          <Text variant="caption" mono style={styles.telemetryText}>
            LATENCY: &lt; 3MS
          </Text>
        </View>
        <View style={styles.telemetryItem}>
          <Ionicons name="radio" size={12} color={colors.emerald} />
          <Text variant="caption" mono style={[styles.telemetryText, { color: colors.emerald }]}>
            STATUS: ACTIVE
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    marginLeft: Spacing.sm,
  },
  callsignRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  callsign: {
    letterSpacing: 0.8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  switcherRow: {
    marginTop: Spacing.sm,
  },
  telemetryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadii.xs,
    marginTop: Spacing.xs + 2,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  telemetryText: {
    fontSize: 10,
    marginLeft: 4,
  },
});
