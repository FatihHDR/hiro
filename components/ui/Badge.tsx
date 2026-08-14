import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export type BadgeVariant = 'status' | 'category' | 'rank' | 'verified' | 'outline';
export type BadgeColor = 'cyan' | 'amber' | 'emerald' | 'crimson' | 'indigo' | 'purple' | 'muted';

export interface EnterpriseBadgeProps {
  label: string;
  variant?: BadgeVariant;
  color?: BadgeColor;
  icon?: React.ReactNode;
  showDot?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<EnterpriseBadgeProps> = ({
  label,
  variant = 'status',
  color = 'cyan',
  icon,
  showDot = false,
  style,
}) => {
  const { colors } = useTheme();

  const getColorHex = (): { bg: string; border: string; text: string; dot: string } => {
    switch (color) {
      case 'cyan':
        return {
          bg: 'rgba(0, 229, 255, 0.12)',
          border: 'rgba(0, 229, 255, 0.45)',
          text: colors.primary,
          dot: colors.primary,
        };
      case 'amber':
        return {
          bg: 'rgba(255, 176, 0, 0.12)',
          border: 'rgba(255, 176, 0, 0.45)',
          text: colors.amber,
          dot: colors.amber,
        };
      case 'emerald':
        return {
          bg: 'rgba(0, 230, 118, 0.12)',
          border: 'rgba(0, 230, 118, 0.45)',
          text: colors.emerald,
          dot: colors.emerald,
        };
      case 'crimson':
        return {
          bg: 'rgba(255, 59, 48, 0.15)',
          border: 'rgba(255, 59, 48, 0.55)',
          text: colors.crimson,
          dot: colors.crimson,
        };
      case 'indigo':
        return {
          bg: 'rgba(99, 102, 241, 0.15)',
          border: 'rgba(99, 102, 241, 0.45)',
          text: colors.indigo,
          dot: colors.indigo,
        };
      case 'purple':
        return {
          bg: 'rgba(168, 85, 247, 0.15)',
          border: 'rgba(168, 85, 247, 0.45)',
          text: colors.purple,
          dot: colors.purple,
        };
      case 'muted':
      default:
        return {
          bg: colors.surfaceElevated,
          border: colors.border,
          text: colors.textSecondary,
          dot: colors.textMuted,
        };
    }
  };

  const palette = getColorHex();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
        },
        style,
      ]}
    >
      {(showDot || variant === 'status') && (
        <View style={[styles.dotRing, { borderColor: `${palette.dot}40` }]}>
          <View style={[styles.dot, { backgroundColor: palette.dot }]} />
        </View>
      )}
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        variant="caption"
        mono={variant === 'rank' || variant === 'status'}
        weight="semibold"
        numberOfLines={1}
        style={{
          color: palette.text,
          fontSize: 9.5,
          letterSpacing: 0.5,
          textTransform: variant === 'status' ? 'uppercase' : 'none',
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  dotRing: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    flexShrink: 0,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  iconContainer: {
    marginRight: Spacing['2xs'] + 2,
    flexShrink: 0,
  },
});
