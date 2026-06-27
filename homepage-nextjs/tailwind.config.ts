import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        accent: 'var(--color-accent)',
        'accent-warm': 'var(--color-accent-warm)',
        'accent-deep': 'var(--color-accent-deep)',
        // Surface
        bg: 'var(--color-bg)',
        'bg-warm': 'var(--color-bg-warm)',
        surface: 'var(--color-surface)',
        'surface-warm': 'var(--color-surface-warm)',
        // Text
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-light': 'var(--color-text-light)',
        // Border
        border: 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        // Status
        success: 'var(--color-success)',
        'success-bg': 'var(--color-success-bg)',
        amber: 'var(--color-amber)',
        'amber-bg': 'var(--color-amber-bg)',
        // Course accents
        opsd: 'var(--color-opsd)',
        'opsd-light': 'var(--color-opsd-light)',
        'opsd-accent': 'var(--color-opsd-accent)',
        industry: 'var(--color-industry)',
        'industry-accent': 'var(--color-industry-accent)',
        pab: 'var(--color-pab)',
        'pab-accent': 'var(--color-pab-accent)',
        police: 'var(--color-police)',
        'police-accent': 'var(--color-police-accent)'
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)']
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)'
      },
      transitionTimingFunction: {
        bounce: 'var(--ease-bounce)',
        smooth: 'var(--ease-smooth)',
        out: 'var(--ease-out)'
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)'
      },
      maxWidth: {
        container: '1200px'
      }
    }
  },
  plugins: []
};

export default config;