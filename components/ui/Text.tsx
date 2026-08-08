import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, TextProps as RNTextProps } from 'react-native';
import { TypographyTokens } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subheading'
  | 'body'
  | 'bodySecondary'
  | 'caption'
  | 'mono'
  | 'statValue';

export interface EnterpriseTextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: keyof typeof TypographyTokens.fontWeights;
  align?: TextStyle['textAlign'];
  mono?: boolean;
  children: React.ReactNode;
}

export const Text: React.FC<EnterpriseTextProps> = ({
  variant = 'body',
  color,
  weight,
  align = 'left',
  mono = false,
  style,
  children,
  ...rest
}) => {
  const { colors } = useTheme();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: TypographyTokens.fontSizes['3xl'],
          fontWeight: TypographyTokens.fontWeights.heavy,
          lineHeight: 38,
          color: colors.textPrimary,
        };
      case 'h2':
        return {
          fontSize: TypographyTokens.fontSizes['2xl'],
          fontWeight: TypographyTokens.fontWeights.bold,
          lineHeight: 32,
          color: colors.textPrimary,
        };
      case 'h3':
        return {
          fontSize: TypographyTokens.fontSizes.xl,
          fontWeight: TypographyTokens.fontWeights.bold,
          lineHeight: 28,
          color: colors.textPrimary,
        };
      case 'subheading':
        return {
          fontSize: TypographyTokens.fontSizes.md,
          fontWeight: TypographyTokens.fontWeights.semibold,
          lineHeight: 22,
          color: colors.textSecondary,
        };
      case 'body':
        return {
          fontSize: TypographyTokens.fontSizes.sm,
          fontWeight: TypographyTokens.fontWeights.regular,
          lineHeight: 20,
          color: colors.textPrimary,
        };
      case 'bodySecondary':
        return {
          fontSize: TypographyTokens.fontSizes.sm,
          fontWeight: TypographyTokens.fontWeights.regular,
          lineHeight: 20,
          color: colors.textSecondary,
        };
      case 'caption':
        return {
          fontSize: TypographyTokens.fontSizes.xs,
          fontWeight: TypographyTokens.fontWeights.regular,
          lineHeight: 16,
          color: colors.textMuted,
        };
      case 'mono':
        return {
          fontSize: TypographyTokens.fontSizes.xs,
          fontFamily: TypographyTokens.fontFamily.mono,
          fontWeight: TypographyTokens.fontWeights.medium,
          lineHeight: 16,
          color: colors.primary,
          letterSpacing: 0.5,
        };
      case 'statValue':
        return {
          fontSize: TypographyTokens.fontSizes['2xl'],
          fontFamily: TypographyTokens.fontFamily.mono,
          fontWeight: TypographyTokens.fontWeights.bold,
          lineHeight: 30,
          color: colors.textPrimary,
        };
    }
  };

  const fontFamilyStyle: TextStyle = (mono || variant === 'mono' || variant === 'statValue')
    ? { fontFamily: TypographyTokens.fontFamily.mono }
    : { fontFamily: TypographyTokens.fontFamily.sans };

  const customWeightStyle: TextStyle = weight
    ? { fontWeight: TypographyTokens.fontWeights[weight] }
    : {};

  const customColorStyle: TextStyle = color ? { color } : {};

  return (
    <RNText
      style={[
        styles.base,
        getVariantStyle(),
        fontFamilyStyle,
        { textAlign: align },
        customWeightStyle,
        customColorStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    padding: 0,
    margin: 0,
  },
});
