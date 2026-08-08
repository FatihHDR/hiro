import { Platform } from 'react-native';

export const EnterpriseColors = {
  dark: {
    background: '#080C14',
    surface: '#0F1624',
    surfaceElevated: '#172033',
    border: '#202C42',
    borderSubtle: '#172236',
    borderActive: '#00E5FF',

    text: '#F8FAFC',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#080C14',

    primary: '#00E5FF',       // Tactical Cyan
    primaryHover: '#00B8CC',
    secondary: '#38BDF8',     // Sky Blue

    // Status Signal Indicators (Crisp, High Contrast, No AI Slop)
    cyan: '#00E5FF',
    amber: '#FFB000',         // Beacon / Warning
    emerald: '#00E676',       // Success / Escrow / Verified
    crimson: '#FF3B30',       // Gate Break / Emergency
    indigo: '#6366F1',        // Guild / Enterprise
    purple: '#A855F7',        // Skill Tree / Specialization
    muted: '#64748B',

    card: '#0F1624',
    tabBar: '#0A0E18',
    tint: '#00E5FF',
    icon: '#94A3B8',
    iconActive: '#00E5FF',
    overlay: 'rgba(4, 7, 13, 0.85)',
  },
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    borderActive: '#0284C7',

    text: '#0F172A',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#F8FAFC',

    primary: '#0284C7',
    primaryHover: '#0369A1',
    secondary: '#0284C7',

    cyan: '#0284C7',
    amber: '#D97706',
    emerald: '#16A34A',
    crimson: '#DC2626',
    indigo: '#4F46E5',
    purple: '#9333EA',
    muted: '#94A3B8',

    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    tint: '#0284C7',
    icon: '#64748B',
    iconActive: '#0284C7',
    overlay: 'rgba(15, 23, 42, 0.65)',
  },
};

export const Colors = EnterpriseColors;

export const Spacing = {
  '3xs': 2,
  '2xs': 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

export const BorderRadii = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const TypographyTokens = {
  fontFamily: Platform.select({
    ios: {
      sans: 'System',
      mono: 'Menlo',
    },
    android: {
      sans: 'Roboto',
      mono: 'monospace',
    },
    default: {
      sans: 'system-ui, -apple-system, sans-serif',
      mono: 'monospace',
    },
  }),
  fontSizes: {
    '2xs': 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};
