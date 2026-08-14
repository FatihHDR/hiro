import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { Text } from './Text';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface EnterpriseSegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string = string>({
  options,
  selectedValue,
  onSelect,
  style,
}: EnterpriseSegmentedControlProps<T>) {
  const { colors } = useTheme();
  const { trigger } = useHaptics();

  const handleSelect = (val: T) => {
    if (val !== selectedValue) {
      trigger('selection');
      onSelect(val);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${colors.surface}F0`,
          borderColor: 'rgba(0, 229, 255, 0.2)',
        },
        style,
      ]}
    >
      {options.map((opt) => {
        const isSelected = opt.value === selectedValue;
        return (
          <Pressable
            key={opt.value}
            onPress={() => handleSelect(opt.value)}
            style={({ pressed }) => [
              styles.segment,
              isSelected && {
                backgroundColor: `${colors.surfaceElevated}`,
                borderColor: 'rgba(0, 229, 255, 0.4)',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 2,
              },
              pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
            ]}
          >
            {opt.icon && <View style={styles.icon}>{opt.icon}</View>}
            <Text
              variant="caption"
              weight={isSelected ? 'bold' : 'medium'}
              color={isSelected ? colors.primary : colors.textSecondary}
              style={styles.label}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 9999,
    borderWidth: 1,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  icon: {
    marginRight: Spacing['2xs'] + 2,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 10,
  },
});
