import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { Text } from './Text';

export interface SwipeToAcceptProps {
  onAccept: () => void;
  title?: string;
  successTitle?: string;
  accentColor?: string;
  disabled?: boolean;
}

const BUTTON_HEIGHT = 50;
const THUMB_SIZE = 42;

export const SwipeToAccept: React.FC<SwipeToAcceptProps> = ({
  onAccept,
  title = 'SWIPE TO ACCEPT MISSION',
  successTitle = 'MISSION ACCEPTED',
  accentColor,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const [containerWidth, setContainerWidth] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const pan = useRef(new Animated.Value(0)).current;
  const primaryColor = accentColor || colors.primary;

  const maxSwipe = Math.max(0, containerWidth - THUMB_SIZE - 8);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && !isSuccess,
      onMoveShouldSetPanResponder: () => !disabled && !isSuccess,
      onPanResponderGrant: () => {
        trigger('light');
      },
      onPanResponderMove: (_, gestureState) => {
        if (disabled || isSuccess) return;
        const newX = Math.max(0, Math.min(gestureState.dx, maxSwipe));
        pan.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (disabled || isSuccess) return;
        if (gestureState.dx >= maxSwipe * 0.7) {
          // Trigger success swipe
          Animated.timing(pan, {
            toValue: maxSwipe,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            setIsSuccess(true);
            trigger('success');
            onAccept();
          });
        } else {
          // Snap back
          Animated.spring(pan, {
            toValue: 0,
            friction: 6,
            tension: 50,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const textOpacity = pan.interpolate({
    inputRange: [0, Math.max(1, maxSwipe * 0.6)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const progressBgWidth = pan.interpolate({
    inputRange: [0, Math.max(1, maxSwipe)],
    outputRange: [THUMB_SIZE + 8, containerWidth || 100],
    extrapolate: 'clamp',
  });

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.container,
        {
          backgroundColor: isSuccess ? `${colors.emerald}20` : colors.surfaceElevated,
          borderColor: isSuccess ? colors.emerald : colors.border,
        },
      ]}
    >
      {/* Animated Filled Progress Track */}
      <Animated.View
        style={[
          styles.progressTrack,
          {
            width: isSuccess ? '100%' : progressBgWidth,
            backgroundColor: isSuccess ? colors.emerald : `${primaryColor}25`,
          },
        ]}
      />

      {/* Center Label */}
      <Animated.View style={[styles.textContainer, { opacity: isSuccess ? 1 : textOpacity }]}>
        <Text
          variant="mono"
          weight="bold"
          color={isSuccess ? colors.emerald : primaryColor}
          style={styles.label}
        >
          {isSuccess ? `✓ ${successTitle}` : title}
        </Text>
      </Animated.View>

      {/* Swipe Thumb */}
      {!isSuccess && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.thumb,
            {
              backgroundColor: primaryColor,
              transform: [{ translateX: pan }],
              shadowColor: primaryColor,
            },
          ]}
        >
          <Ionicons name="chevron-forward" size={18} color={colors.textInverse} />
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textInverse}
            style={{ marginLeft: -10, opacity: 0.6 }}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BUTTON_HEIGHT,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 8,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 7,
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THUMB_SIZE,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  thumb: {
    position: 'absolute',
    left: 4,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    cursor: 'pointer',
  },
});
