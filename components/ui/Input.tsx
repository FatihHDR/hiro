import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { BorderRadii, Spacing, TypographyTokens } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export interface EnterpriseInputProps extends TextInputProps {
  label?: string;
  errorText?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  mono?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
}

export const Input: React.FC<EnterpriseInputProps> = ({
  label,
  errorText,
  helperText,
  leftIcon,
  rightIcon,
  mono = false,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  editable = true,
  testID,
  ...rest
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const getBorderColor = () => {
    if (errorText) return colors.crimson;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text variant="caption" weight="semibold" style={styles.label}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: editable ? colors.surface : colors.surfaceElevated,
            borderColor: getBorderColor(),
          },
          !editable && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          testID={testID}
          editable={editable}
          placeholderTextColor={colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontFamily: mono
                ? TypographyTokens.fontFamily.mono
                : TypographyTokens.fontFamily.sans,
            },
            inputStyle,
          ]}
          {...rest}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {errorText ? (
        <Text variant="caption" color={colors.crimson} style={styles.helper}>
          {errorText}
        </Text>
      ) : helperText ? (
        <Text variant="caption" color={colors.textMuted} style={styles.helper}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
    width: '100%',
  },
  label: {
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadii.md,
    paddingHorizontal: Spacing.md,
    minHeight: 46,
  },
  input: {
    flex: 1,
    fontSize: TypographyTokens.fontSizes.sm,
    paddingVertical: Spacing.xs + 2,
  },
  leftIcon: {
    marginRight: Spacing.xs + 2,
  },
  rightIcon: {
    marginLeft: Spacing.xs + 2,
  },
  helper: {
    marginTop: Spacing['2xs'] + 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
