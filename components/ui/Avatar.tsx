import React from 'react';
import { View, StyleSheet, Image, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadii } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export interface EnterpriseAvatarProps {
  name: string;
  avatarUrl?: string;
  level?: number;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export const Avatar: React.FC<EnterpriseAvatarProps> = ({
  name,
  avatarUrl,
  level,
  isVerified = true,
  size = 'md',
  style,
}) => {
  const { colors } = useTheme();

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const getSizePx = (): { dimension: number; fontSize: number; iconSize: number } => {
    switch (size) {
      case 'sm':
        return { dimension: 32, fontSize: 12, iconSize: 10 };
      case 'md':
        return { dimension: 44, fontSize: 16, iconSize: 12 };
      case 'lg':
        return { dimension: 56, fontSize: 20, iconSize: 14 };
      case 'xl':
        return { dimension: 72, fontSize: 26, iconSize: 16 };
    }
  };

  const dim = getSizePx();

  return (
    <View style={[styles.wrapper, { width: dim.dimension, height: dim.dimension }, style]}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={[
            styles.image,
            {
              width: dim.dimension,
              height: dim.dimension,
              borderColor: colors.border,
              backgroundColor: colors.surfaceElevated,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: dim.dimension,
              height: dim.dimension,
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.primary,
            },
          ]}
        >
          <Text
            variant="caption"
            weight="bold"
            mono
            style={{ fontSize: dim.fontSize, color: colors.primary }}
          >
            {getInitials(name)}
          </Text>
        </View>
      )}

      {isVerified && (
        <View
          style={[
            styles.verifiedBadge,
            { backgroundColor: colors.emerald, borderColor: colors.background },
          ]}
        >
          <Ionicons name="checkmark" size={dim.iconSize} color="#000" />
        </View>
      )}

      {level !== undefined && (
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: colors.primary, borderColor: colors.background },
          ]}
        >
          <Text variant="caption" weight="heavy" style={styles.levelText}>
            {level}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  image: {
    borderRadius: BorderRadii.md,
    borderWidth: 1.5,
  },
  placeholder: {
    borderRadius: BorderRadii.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderRadius: BorderRadii.full,
    padding: 2,
    borderWidth: 1.5,
  },
  levelBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: BorderRadii.xs,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
  },
  levelText: {
    fontSize: 9,
    color: '#000',
  },
});
