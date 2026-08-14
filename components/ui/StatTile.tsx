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
  badge?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const StatTile: React.FC<EnterpriseStatTileProps> = ({
  label,
  value,
  subValue,
  badge,
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
          borderColor: `${effectiveAccent}40`,
          shadowColor: effectiveAccent,
        },
        pressed && onPress ? { opacity: 0.85, transform: [{ scale: 0.98 }] } : null,
        style as any,
      ]}
    >
      {/* 21st.dev Top Light Ray Highlight */}
      <View
        style={[
          styles.topRay,
          { backgroundColor: effectiveAccent },
        ]}
      />

      {/* Header Row: Label & Icon/Badge */}
      <View style={styles.headerRow}>
        <Text
          variant="caption"
          weight="bold"
          color={colors.textSecondary}
          numberOfLines={1}
          style={styles.label}
        >
          {label}
        </Text>

        {badge ? (
          <View style={[styles.badgePill, { backgroundColor: `${effectiveAccent}20`, borderColor: effectiveAccent }]}>
            <Text variant="mono" weight="bold" color={effectiveAccent} numberOfLines={1} style={styles.badgeText}>
              {badge}
            </Text>
          </View>
        ) : icon ? (
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: `${effectiveAccent}15`,
                borderColor: `${effectiveAccent}35`,
              },
            ]}
          >
            {icon}
          </View>
        ) : null}
      </View>

      {/* Value Row */}
      <View style={styles.valueRow}>
        <Text
          variant="h3"
          mono
          numberOfLines={1}
          style={[
            styles.valueText,
            {
              color: effectiveAccent,
            },
          ]}
        >
          {value}
        </Text>
      </View>

      {/* SubValue Row */}
      {subValue && (
        <View style={styles.subValueRow}>
          <View style={[styles.miniDot, { backgroundColor: effectiveAccent }]} />
          <Text
            variant="caption"
            color={colors.textMuted}
            numberOfLines={1}
            style={styles.subValue}
          >
            {subValue}
          </Text>
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadii.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 90,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  topRay: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontSize: 9.5,
    flex: 1,
    marginRight: 4,
  },
  badgePill: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 8,
    letterSpacing: 0.4,
  },
  iconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  valueRow: {
    marginVertical: 1,
  },
  valueText: {
    fontSize: 17,
    letterSpacing: 0.5,
    fontWeight: '800',
  },
  subValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  miniDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 5,
    flexShrink: 0,
  },
  subValue: {
    fontSize: 10,
    flex: 1,
  },
});
