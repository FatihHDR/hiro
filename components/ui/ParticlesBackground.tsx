import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

interface ParticlesBackgroundProps {
  quantity?: number;
  staticity?: number;
  ease?: number;
  color?: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 21st.dev inspired interactive Particle Field background
export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  quantity = 28,
  color,
}) => {
  const { colors, isDark } = useTheme();
  const particleColor = color || (isDark ? colors.primary : colors.textMuted);

  const particles = useRef(
    [...Array(quantity)].map(() => ({
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT,
      r: Math.random() * 2 + 1,
      opacity: new Animated.Value(Math.random() * 0.5 + 0.2),
      translateY: new Animated.Value(0),
      duration: Math.random() * 3000 + 2000,
    }))
  ).current;

  useEffect(() => {
    particles.forEach((p) => {
      // Floating animation loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(p.translateY, {
            toValue: -20 - Math.random() * 20,
            duration: p.duration,
            useNativeDriver: true,
          }),
          Animated.timing(p.translateY, {
            toValue: 0,
            duration: p.duration,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Opacity pulse loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(p.opacity, {
            toValue: 0.8,
            duration: p.duration * 0.8,
            useNativeDriver: false,
          }),
          Animated.timing(p.opacity, {
            toValue: 0.15,
            duration: p.duration * 0.8,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  }, [particles]);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Radial Gradient Core */}
      <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient
            id="heroRadial"
            cx="50%"
            cy="35%"
            r="60%"
            fx="50%"
            fy="35%"
          >
            <Stop offset="0%" stopColor={isDark ? `${colors.primary}18` : `${colors.primary}08`} />
            <Stop offset="60%" stopColor={isDark ? `${colors.primary}05` : 'transparent'} />
            <Stop offset="100%" stopColor="transparent" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#heroRadial)" />

        {/* Static background particles */}
        {particles.map((p, idx) => (
          <Circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={particleColor}
            opacity={0.3}
          />
        ))}
      </Svg>
    </View>
  );
};
