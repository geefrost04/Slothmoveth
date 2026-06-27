'use client';

import { useTheme } from './ThemeProvider';

export function FloatingThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className={`theme-toggle${theme === 'dark' ? ' dark-mode' : ''}`}
      id="themeToggle"
      onClick={toggle}
      aria-label="สลับโหมดมืด/สว่าง"
      role="switch"
      aria-checked={theme === 'dark'}
    >
      <span className="toggle-icon sun">☀️</span>
      <span className="toggle-icon moon">🌙</span>
      <span className="toggle-knob" />
    </button>
  );
}
