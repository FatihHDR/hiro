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
  testID,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();

  const getAccentColor = (): string => {
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
        return 'transparent';
    }
  };

  const accentColor = getAccentColor();
  const hasAccent = accent !== 'none';

  const handlePress = () => {
    if (onPress) {
      trigger('selection');
      onPress();
    }
  };

  const cardBaseStyle: ViewStyle = {
    backgroundColor: elevated ? `${colors.surfaceElevated}F5` : `${colors.surface}F5`,
    borderColor: hasAccent ? `${accentColor}55` : colors.border,
    borderWidth: 1,
    shadowColor: hasAccent ? accentColor : '#000',
    shadowOffset: { width: 0, height: hasAccent || elevated ? 4 : 2 },
    shadowOpacity: hasAccent ? 0.22 : 0.15,
    shadowRadius: hasAccent ? 8 : 4,
    elevation: elevated ? 6 : 2,
  };

  const contentElement = (
    <>
      {/* 21st.dev Subtle Top Light Ray Highlight */}
      <View
        style={[
          styles.topLightRay,
          {
            backgroundColor: hasAccent ? `${accentColor}60` : 'rgba(255, 255, 255, 0.12)',
          },
        ]}
      />

      {/* Top Accent Indicator Bar */}
      {hasAccent && (
        <View
          style={[
            styles.accentBar,
            { backgroundColor: accentColor },
          ]}
        />
      )}

      <View style={[styles.content, contentStyle]}>{children}</View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          cardBaseStyle,
          style,
          pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
        ]}
      >
        {contentElement}
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
      {contentElement}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadii.md,
    overflow: 'hidden',
    position: 'relative',
  },
  topLightRay: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 1,
    zIndex: 2,
  },
  accentBar: {
    height: 2.5,
    width: '100%',
  },
  content: {
    padding: Spacing.md,
  },
});
