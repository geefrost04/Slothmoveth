/**
 * Course Theme System
 *
 * Each course provides a theme object. The shape is shared across the
 * platform so the same `<CourseLayout>` can render any course.
 *
 * Applied via CSS variables on a wrapper element:
 *   <div data-course-theme style={{ '--color-primary': theme.primary, ... }}>
 */

export interface CourseTheme {
  /** Primary brand color (titles, primary buttons) */
  primary: string;
  /** Darker primary for hover/active */
  primaryDark: string;
  /** Accent color (badges, highlights, secondary CTAs) */
  accent: string;
  /** Soft accent background (badges, hover surfaces) */
  accentSoft: string;
  /** Background surface (cards, popups) */
  surface: string;
  /** Logo path (relative to /public) */
  logo: string;
  /** Optional mascot path (relative to /public) */
  mascot?: string;
}

/**
 * Default theme — used when a course doesn't override.
 * Matches the SlothMove Editorial Warm aesthetic.
 */
export const DEFAULT_THEME: CourseTheme = {
  primary: '#1a1a2e',
  primaryDark: '#0f0f1e',
  accent: '#c97d3a',
  accentSoft: '#fdf3e8',
  surface: '#ffffff',
  logo: '/pic/slothmove_mascot.png',
  mascot: '/pic/slothmove_mascot.svg'
};

/**
 * Apply a theme to a CSSProperties target. Returns the inline style object.
 *
 * Usage:
 *   <div style={applyTheme(theme)}>...</div>
 */
export function applyTheme(theme: CourseTheme): React.CSSProperties {
  return {
    '--color-primary': theme.primary,
    '--color-primary-dark': theme.primaryDark,
    '--color-accent': theme.accent,
    '--color-accent-soft': theme.accentSoft,
    '--color-surface': theme.surface
  } as React.CSSProperties;
}

/**
 * Build the full token set for a course by merging with defaults.
 * Use this in component-level CSS-in-JS when needed.
 */
export function buildTokens(theme: Partial<CourseTheme>): CourseTheme {
  return { ...DEFAULT_THEME, ...theme };
}
