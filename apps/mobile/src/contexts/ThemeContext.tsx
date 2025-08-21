import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeContextType {
  theme: 'retro' | 'neon' | 'classic';
  colors: ThemeColors;
  setTheme: (theme: 'retro' | 'neon' | 'classic') => void;
}

const themes = {
  retro: {
    primary: '#00ff00',
    secondary: '#00aa00',
    background: '#001100',
    surface: '#002200',
    text: '#00ff00',
    success: '#00ff00',
    warning: '#ffaa00',
    error: '#ff0000',
  },
  neon: {
    primary: '#00ffff',
    secondary: '#0088ff',
    background: '#001122',
    surface: '#002244',
    text: '#00ffff',
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff0088',
  },
  classic: {
    primary: '#ffffff',
    secondary: '#cccccc',
    background: '#000000',
    surface: '#222222',
    text: '#ffffff',
    success: '#00ff00',
    warning: '#ffaa00',
    error: '#ff0000',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'retro' | 'neon' | 'classic'>('retro');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setThemeState(savedTheme as 'retro' | 'neon' | 'classic');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const setTheme = async (newTheme: 'retro' | 'neon' | 'classic') => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const colors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};