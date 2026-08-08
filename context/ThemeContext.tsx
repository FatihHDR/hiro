import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { EnterpriseColors } from '../constants/theme';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  colors: typeof EnterpriseColors.dark;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'light' ? 'light' : 'dark');

  const colors = EnterpriseColors[mode];
  const isDark = mode === 'dark';

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ mode, colors, setMode, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useEnterpriseTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      mode: 'dark',
      colors: EnterpriseColors.dark,
      setMode: () => {},
      toggleTheme: () => {},
      isDark: true,
    };
  }
  return context;
};
