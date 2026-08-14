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

const TAB_BUTTON_WIDTH = 50;
const TAB_GAP = 6;

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

  // Initial & layout driven animation
  useEffect(() => {
    let targetX = 0;
    if (itemLayouts[activeIndex]) {
      const { x, width } = itemLayouts[activeIndex];
      targetX = x + width / 2;
    } else {
      // Fallback calculation: 8 padding + index * (50 + 6) + 25
      targetX = 8 + activeIndex * (TAB_BUTTON_WIDTH + TAB_GAP) + TAB_BUTTON_WIDTH / 2;
    }

    Animated.parallel([
      Animated.spring(tooltipX, {
        toValue: targetX,
        useNativeDriver: true,
        tension: 75,
        friction: 9,
      }),
      Animated.sequence([
        Animated.timing(tooltipScale, {
          toValue: 0.82,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(tooltipScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 90,
          friction: 7,
        }),
      ]),
    ]).start();
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
          bottom: Math.max(insets.bottom, Platform.OS === 'web' ? 18 : 12),
        },
      ]}
    >
      <View style={styles.dockWrapper}>
        {/* Animated Tooltip Bubble above active tab */}
        <Animated.View
          style={[
            styles.tooltipContainer,
            {
              transform: [
                { translateX: tooltipX },
                { translateX: -50 }, // offset half of 100px tooltip width
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
                backgroundColor: `${colors.surfaceElevated}FA`,
                borderColor: colors.primary,
                shadowColor: colors.primary,
              },
            ]}
          >
            <View style={[styles.tooltipLiveDot, { backgroundColor: colors.primary }]} />
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

        {/* 21st.dev Floating Rounded Dock MenuBar */}
        <View
          style={[
            styles.menuBar,
            {
              backgroundColor: 'rgba(10, 16, 26, 0.94)',
              borderColor: 'rgba(0, 229, 255, 0.45)',
            },
          ]}
        >
          {/* Subtle Top Shimmer Line */}
          <View style={styles.dockTopRay} />

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
                    backgroundColor: 'rgba(0, 229, 255, 0.22)',
                    borderColor: 'rgba(0, 229, 255, 0.7)',
                    borderWidth: 1,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 6,
                  },
                  pressed && { opacity: 0.7, transform: [{ scale: 0.92 }] },
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={21}
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
    zIndex: 9999,
  },
  dockWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  tooltipContainer: {
    position: 'absolute',
    top: -36,
    left: 0,
    zIndex: 10000,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  tooltipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
  },
  tooltipText: {
    fontSize: 10,
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  menuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1.5,
    gap: TAB_GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  dockTopRay: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.4)',
  },
  tabButton: {
    width: TAB_BUTTON_WIDTH,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
