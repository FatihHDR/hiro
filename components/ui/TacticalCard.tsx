import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Pressable } from 'react-native';
import { BorderRadii, Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export type AccentColorType = 'cyan' | 'amber' | 'emerald' | 'crimson' | 'indigo' | 'purple' | 'muted' | 'none';

export interface TacticalCardProps {
  children: React.ReactNode;
  accent?: AccentColorType;
  elevated?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  headerTag?: string;
  testID?: string;
}

export const TacticalCard: React.FC<TacticalCardProps> = ({
  children,
  accent = 'none',
  elevated = false,
  onPress,
  style,
  contentStyle,
  headerTag,
  testID,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();

  const getAccentBorderColor = (): string => {
    switch (accent) {
      case 'cyan':
        return colors.primary;
      case 'amber':
        return colors.amber;
      case 'emerald':
        return colors.emerald;
      case 'crimson':
        return colors.crimson;
      case 'indigo':
        return colors.indigo;
      case 'purple':
        return colors.purple;
      case 'muted':
        return colors.border;
      case 'none':
      default:
        return colors.border;
    }
  };

  const handlePress = () => {
    if (onPress) {
      trigger('selection');
      onPress();
    }
  };

  const cardBaseStyle: ViewStyle = {
    backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
    borderColor: getAccentBorderColor(),
    borderWidth: accent !== 'none' ? 1.5 : 1,
  };

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          cardBaseStyle,
          style,
          pressed && { opacity: 0.9, transform: [{ scale: 0.995 }] },
        ]}
      >
        {accent !== 'none' && (
          <View
            style={[
              styles.accentBar,
              { backgroundColor: getAccentBorderColor() },
            ]}
          />
        )}
        <View style={[styles.content, contentStyle]}>{children}</View>
      </Pressable>
    );
  }

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        cardBaseStyle,
        style,
      ]}
    >
      {accent !== 'none' && (
        <View
          style={[
            styles.accentBar,
            { backgroundColor: getAccentBorderColor() },
          ]}
        />
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadii.md,
    overflow: 'hidden',
    position: 'relative',
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  content: {
    padding: Spacing.md,
  },
});
