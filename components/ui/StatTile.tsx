import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Pressable } from 'react-native';
import { BorderRadii, Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { Text } from './Text';

export interface EnterpriseStatTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const StatTile: React.FC<EnterpriseStatTileProps> = ({
  label,
  value,
  subValue,
  icon,
  accentColor,
  style,
  onPress,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const effectiveAccent = accentColor || colors.primary;

  const handlePress = () => {
    if (onPress) {
      trigger('selection');
      onPress();
    }
  };

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress ? handlePress : undefined}
      style={({ pressed }: { pressed?: boolean }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        pressed && onPress ? { opacity: 0.85, transform: [{ scale: 0.98 }] } : null,
        style as any,
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
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadii.md,
    borderWidth: 1,
    flex: 1,
    minWidth: 100,
    cursor: 'pointer',
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
    fontSize: 9,
  },
  iconWrapper: {
    padding: 4,
    borderRadius: BorderRadii.xs,
  },
  subValue: {
    marginTop: Spacing['2xs'],
    fontSize: 10,
  },
});
