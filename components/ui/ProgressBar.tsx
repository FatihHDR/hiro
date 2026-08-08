import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BorderRadii, Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export interface EnterpriseProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  valueText?: string;
  color?: string;
  height?: number;
  segmented?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<EnterpriseProgressBarProps> = ({
  progress,
  label,
  valueText,
  color,
  height = 8,
  segmented = false,
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
            <Text variant="caption" weight="semibold" style={styles.label}>
              {label}
            </Text>
          )}
          {valueText && (
            <Text variant="mono" style={{ color: activeColor }}>
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
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress * 100}%`,
              backgroundColor: activeColor,
            },
          ]}
        />
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
  },
  track: {
    width: '100%',
    borderRadius: BorderRadii.xs,
    overflow: 'hidden',
    borderWidth: 1,
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadii.none,
  },
});
