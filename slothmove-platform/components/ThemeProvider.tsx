'use client';

import { createContext, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} });

function readThemeFromDocument(): Theme {
  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    try {
      localStorage.setItem('slothmove-theme', 'light');
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: readThemeFromDocument(), toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
