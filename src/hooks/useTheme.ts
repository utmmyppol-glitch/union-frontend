'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Theme } from '@/types';

const STORAGE_KEY = 'union-theme';

const THEMES = {
  light: {
    '--bg': '#F4F7FB',
    '--surface': '#ffffff',
    '--soft': '#EDF2FB',
    '--ink': '#0B1220',
    '--ink2': '#5A6678',
    '--line': '#E2E8F2',
    '--primary': '#111214',
    '--accent': '#111214',
    '--purple': '#2B2C30',
    '--green': '#059669',
  },
  dark: {
    '--bg': '#0B1020',
    '--surface': '#141A2B',
    '--soft': '#0E1424',
    '--ink': '#EAF0F7',
    '--ink2': '#93A0B4',
    '--line': '#26304A',
    '--primary': '#3B82F6',
    '--accent': '#38BDF8',
    '--purple': '#A78BFA',
    '--green': '#34D399',
  },
} as const;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  const vars = THEMES[theme];
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light');

  // Read persisted preference on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored === 'dark' ? 'dark' : 'light';
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  const isDark = theme === 'dark';

  return { theme, toggleTheme, isDark } as const;
}
