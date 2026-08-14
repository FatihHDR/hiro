import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { Text } from './Text';

export interface MenuBarItem {
  name: string;
  label: string;
  icon: (focused: boolean, color: string) => React.ReactNode;
}

interface CustomBottomMenuProps extends BottomTabBarProps {
  items?: MenuBarItem[];
}

export const BottomMenuBar: React.FC<CustomBottomMenuProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const insets = useSafeAreaInsets();

  const [itemLayouts, setItemLayouts] = useState<{ [index: number]: { x: number; width: number } }>({});
  const tooltipX = useRef(new Animated.Value(0)).current;
  const tooltipOpacity = useRef(new Animated.Value(1)).current;
  const tooltipScale = useRef(new Animated.Value(1)).current;

  const activeIndex = state.index;
  const activeRoute = state.routes[activeIndex];
  const activeOptions = descriptors[activeRoute.key]?.options;
  const activeLabel =
    typeof activeOptions?.title === 'string'
      ? activeOptions.title
      : activeRoute.name.toUpperCase();

  useEffect(() => {
    if (itemLayouts[activeIndex]) {
      const { x, width } = itemLayouts[activeIndex];
      const targetX = x + width / 2;

      Animated.parallel([
        Animated.spring(tooltipX, {
          toValue: targetX,
          useNativeDriver: true,
          tension: 68,
          friction: 10,
        }),
        Animated.sequence([
          Animated.timing(tooltipScale, {
            toValue: 0.85,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.spring(tooltipScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 80,
            friction: 8,
          }),
        ]),
      ]).start();
    }
  }, [activeIndex, itemLayouts, tooltipScale, tooltipX]);

  const handleItemLayout = (index: number, x: number, width: number) => {
    setItemLayouts((prev) => ({
      ...prev,
      [index]: { x, width },
    }));
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.outerContainer,
        {
          bottom: Math.max(insets.bottom, Platform.OS === 'web' ? 16 : 12),
        },
      ]}
    >
      <View style={styles.dockWrapper}>
        {/* Animated Tooltip Bubble above active tab */}
        {itemLayouts[activeIndex] && (
          <Animated.View
            style={[
              styles.tooltipContainer,
              {
                transform: [
                  { translateX: tooltipX },
                  { translateX: -40 }, // offset half tooltip width
                  { scale: tooltipScale },
                ],
                opacity: tooltipOpacity,
              },
            ]}
          >
            <View
              style={[
                styles.tooltipPill,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ]}
            >
              <Text
                variant="mono"
                weight="bold"
                color={colors.primary}
                style={styles.tooltipText}
              >
                {activeLabel}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Floating Rounded Dock MenuBar */}
        <View
          style={[
            styles.menuBar,
            {
              backgroundColor: `${colors.surface}F0`,
              borderColor: 'rgba(0, 229, 255, 0.3)',
            },
          ]}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              trigger('selection');
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let iconName: keyof typeof Ionicons.glyphMap = 'compass';
            if (route.name === 'index') {
              iconName = isFocused ? 'compass' : 'compass-outline';
            } else if (route.name === 'explore') {
              iconName = isFocused ? 'list' : 'list-outline';
            } else if (route.name === 'raids') {
              iconName = isFocused ? 'shield-half' : 'shield-outline';
            } else if (route.name === 'vault') {
              iconName = isFocused ? 'wallet' : 'wallet-outline';
            } else if (route.name === 'profile') {
              iconName = isFocused ? 'person' : 'person-outline';
            }

            return (
              <Pressable
                key={route.key}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout;
                  handleItemLayout(index, x, width);
                }}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                style={({ pressed }) => [
                  styles.tabButton,
                  isFocused && {
                    backgroundColor: `${colors.primary}20`,
                    borderColor: `${colors.primary}60`,
                    borderWidth: 1,
                  },
                  pressed && { opacity: 0.75, transform: [{ scale: 0.94 }] },
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={20}
                  color={isFocused ? colors.primary : colors.textMuted}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  dockWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  tooltipContainer: {
    position: 'absolute',
    top: -34,
    left: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  tooltipPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  tooltipText: {
    fontSize: 10,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  menuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  tabButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
