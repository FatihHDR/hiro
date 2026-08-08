import React from 'react';
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';
import { BorderRadii, Spacing, TypographyTokens } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics, HapticType } from '../../hooks/useHaptics';
import { Text } from './Text';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'emergency'
  | 'danger'
  | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface EnterpriseButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  hapticType?: HapticType;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const Button: React.FC<EnterpriseButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  hapticType,
  style,
  textStyle,
  onPress,
  testID,
  ...rest
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();

  const handlePress = (e: any) => {
    if (disabled || loading) return;

    const defaultHaptic: HapticType =
      variant === 'emergency' ? 'emergency' : 'medium';

    trigger(hapticType || defaultHaptic);

    if (onPress) {
      onPress(e);
    }
  };

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle; spinnerColor: string } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            borderWidth: 1,
          },
          text: {
            color: colors.textInverse,
            fontWeight: TypographyTokens.fontWeights.bold,
          },
          spinnerColor: colors.textInverse,
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            borderWidth: 1,
          },
          text: {
            color: colors.textPrimary,
            fontWeight: TypographyTokens.fontWeights.semibold,
          },
          spinnerColor: colors.textPrimary,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: colors.primary,
            borderWidth: 1.5,
          },
          text: {
            color: colors.primary,
            fontWeight: TypographyTokens.fontWeights.semibold,
          },
          spinnerColor: colors.primary,
        };
      case 'emergency':
        return {
          container: {
            backgroundColor: colors.crimson,
            borderColor: colors.crimson,
            borderWidth: 1.5,
          },
          text: {
            color: '#FFFFFF',
            fontWeight: TypographyTokens.fontWeights.heavy,
            letterSpacing: 1,
          },
          spinnerColor: '#FFFFFF',
        };
      case 'danger':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: colors.crimson,
            borderWidth: 1.5,
          },
          text: {
            color: colors.crimson,
            fontWeight: TypographyTokens.fontWeights.semibold,
          },
          spinnerColor: colors.crimson,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: colors.textSecondary,
            fontWeight: TypographyTokens.fontWeights.medium,
          },
          spinnerColor: colors.textSecondary,
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; textVariant: 'caption' | 'body' | 'subheading' } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.md,
            borderRadius: BorderRadii.sm,
          },
          textVariant: 'caption',
        };
      case 'md':
        return {
          container: {
            paddingVertical: Spacing.sm + 2,
            paddingHorizontal: Spacing.lg,
            borderRadius: BorderRadii.md,
          },
          textVariant: 'body',
        };
      case 'lg':
        return {
          container: {
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.xl,
            borderRadius: BorderRadii.md,
          },
          textVariant: 'subheading',
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        sizeStyle.container,
        variantStyle.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}
      {...rest}
    >
      <View style={styles.innerContent}>
        {loading ? (
          <ActivityIndicator size="small" color={variantStyle.spinnerColor} style={styles.iconMargin} />
        ) : (
          leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>
        )}

        <Text
          variant={sizeStyle.textVariant}
          style={[variantStyle.text, textStyle]}
          mono={variant === 'emergency'}
        >
          {title}
        </Text>

        {!loading && rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: Spacing.xs,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
  iconMargin: {
    marginRight: Spacing.xs,
  },
});
