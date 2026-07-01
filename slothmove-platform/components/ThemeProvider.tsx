'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} });

function readThemeFromDocument(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(readThemeFromDocument());
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('slothmove-theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'slothmove-theme') return;
      const nextTheme = event.newValue === 'dark' ? 'dark' : 'light';
      setTheme(nextTheme);
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function toggle() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
