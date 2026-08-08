import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BorderRadii, Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export interface EnterpriseStatTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
}

export const StatTile: React.FC<EnterpriseStatTileProps> = ({
  label,
  value,
  subValue,
  icon,
  accentColor,
  style,
}) => {
  const { colors } = useTheme();
  const effectiveAccent = accentColor || colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <View style={styles.headerRow}>
        <Text variant="caption" weight="semibold" style={styles.label}>
          {label}
        </Text>
        {icon && (
          <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
            {icon}
          </View>
        )}
      </View>

      <Text
        variant="statValue"
        style={{ color: effectiveAccent }}
      >
        {value}
      </Text>

      {subValue && (
        <Text variant="caption" style={styles.subValue}>
          {subValue}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadii.md,
    borderWidth: 1,
    flex: 1,
    minWidth: 140,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  iconWrapper: {
    padding: 4,
    borderRadius: BorderRadii.xs,
  },
  subValue: {
    marginTop: Spacing['2xs'],
  },
});
