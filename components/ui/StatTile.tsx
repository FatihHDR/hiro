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
          backgroundColor: `${colors.surface}F5`,
          borderColor: `${effectiveAccent}35`,
          shadowColor: effectiveAccent,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.18,
          shadowRadius: 6,
          elevation: 3,
        },
        pressed && onPress ? { opacity: 0.85, transform: [{ scale: 0.97 }] } : null,
        style as any,
      ]}
    >
      {/* 21st.dev Light Ray Highlight */}
      <View
        style={[
          styles.topRay,
          { backgroundColor: `${effectiveAccent}50` },
        ]}
      />

      <View style={styles.headerRow}>
        <Text variant="caption" weight="semibold" color={colors.textSecondary} style={styles.label}>
          {label}
        </Text>
        {icon && (
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: `${effectiveAccent}15`,
                borderColor: `${effectiveAccent}35`,
                borderWidth: 1,
              },
            ]}
          >
            {icon}
          </View>
        )}
      </View>

      <Text
        variant="statValue"
        style={[
          styles.valueText,
          {
            color: effectiveAccent,
          },
        ]}
      >
        {value}
      </Text>

      {subValue && (
        <View style={styles.subValueRow}>
          <View style={[styles.miniDot, { backgroundColor: effectiveAccent }]} />
          <Text variant="caption" color={colors.textMuted} style={styles.subValue}>
            {subValue}
          </Text>
        </View>
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
    overflow: 'hidden',
    position: 'relative',
  },
  topRay: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 1,
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
  valueText: {
    letterSpacing: 0.5,
    marginVertical: 2,
  },
  subValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing['2xs'],
  },
  miniDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 5,
  },
  subValue: {
    fontSize: 10,
  },
});
