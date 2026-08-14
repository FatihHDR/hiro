import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export interface EnterpriseProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  valueText?: string;
  color?: string;
  height?: number;
  segmented?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar: React.FC<EnterpriseProgressBarProps> = ({
  progress,
  label,
  valueText,
  color,
  height = 8,
  style,
}) => {
  const { colors } = useTheme();
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const activeColor = color || colors.primary;

  return (
    <View style={[styles.wrapper, style]}>
      {(label || valueText) && (
        <View style={styles.labelRow}>
          {label && (
            <Text variant="caption" weight="semibold" color={colors.textSecondary} style={styles.label}>
              {label}
            </Text>
          )}
          {valueText && (
            <Text variant="mono" weight="bold" style={{ color: activeColor, fontSize: 11 }}>
              {valueText}
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: `${colors.surfaceElevated}F0`,
            borderColor: 'rgba(255, 255, 255, 0.08)',
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress * 100}%`,
              backgroundColor: activeColor,
              shadowColor: activeColor,
            },
          ]}
        >
          {/* 21st.dev Glowing Leading Edge Dot */}
          {clampedProgress > 0.05 && (
            <View style={[styles.leadingGlow, { backgroundColor: '#FFFFFF' }]} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['2xs'] + 2,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  track: {
    width: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
    borderWidth: 1,
  },
  fill: {
    height: '100%',
    borderRadius: 9999,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  leadingGlow: {
    width: 3,
    height: '80%',
    borderRadius: 2,
    marginRight: 2,
    opacity: 0.8,
  },
});
