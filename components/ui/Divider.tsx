import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export interface EnterpriseDividerProps {
  label?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<EnterpriseDividerProps> = ({ label, style }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      {label && (
        <View style={[styles.labelBadge, { backgroundColor: colors.background }]}>
          <Text variant="mono" style={{ fontSize: 9, color: colors.textMuted }}>
            {label}
          </Text>
        </View>
      )}
      {label && <View style={[styles.line, { backgroundColor: colors.border }]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
  },
  labelBadge: {
    paddingHorizontal: Spacing.xs + 2,
  },
});
