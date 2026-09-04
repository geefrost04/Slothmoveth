import React from 'react';

type SlothMoveLogoProps = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function SlothMoveIcon({ size = 28, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, borderRadius: `${size * 0.28}px`, ...style }}
      aria-hidden="true"
    >
      <defs>
        {/* Rich Emerald Gradient */}
        <linearGradient id="smGradBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="55%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Top Highlight Sheen */}
        <linearGradient id="smSheen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Lower Ribbon Gradient */}
        <linearGradient id="smLowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6fffa" />
        </linearGradient>

        {/* Upper Ribbon Gradient */}
        <linearGradient id="smUpperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ccfbf1" />
        </linearGradient>

        {/* Golden Spark / Beacon */}
        <linearGradient id="smSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Ribbon Intersect Drop Shadow */}
        <filter id="smRibbonShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#044e38" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Squircle Base with Precision Border */}
      <rect x="4" y="4" width="112" height="112" rx="34" fill="url(#smGradBg)" />
      <rect x="4" y="4" width="112" height="112" rx="34" fill="url(#smSheen)" />
      <rect x="4" y="4" width="112" height="112" rx="34" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.25" />

      {/* Lower S-Loop (Grounded deliberate foundation) */}
      <path
        d="M 48 59 C 64 65 88 71 88 87 C 88 99 76 107 58 107 C 42 107 32 99 30 87"
        fill="none"
        stroke="url(#smLowerGrad)"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Upper S-Loop & Overlapping Diagonal (Kinetic leap forward) */}
      <path
        d="M 80 29 C 78 19 68 15 56 15 C 42 15 34 23 34 35 C 34 49 46 55 66 61 L 72 63"
        fill="none"
        stroke="url(#smUpperGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        filter="url(#smRibbonShadow)"
      />

      {/* Golden Ascent Arrow / Beacon (Continuous Forward Move) */}
      <polygon points="84,13 99,13 99,28 91,20" fill="url(#smSparkGrad)" filter="url(#smRibbonShadow)" />
    </svg>
  );
}

export function SlothMoveLogo({ size = 28, showWordmark = true, className, style }: SlothMoveLogoProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${Math.round(size * 0.32)}px`,
        textDecoration: 'none',
        lineHeight: 1,
        ...style
      }}
    >
      <SlothMoveIcon size={size} />
      {showWordmark && (
        <span
          style={{
            fontFamily: "var(--font-display, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
            fontSize: `${Math.round(size * 0.72)}px`,
            fontWeight: 900,
            letterSpacing: '-0.025em',
            color: '#0f172a',
            display: 'inline-flex',
            alignItems: 'baseline'
          }}
        >
          Sloth<span style={{ color: '#16a34a' }}>Move</span>
        </span>
      )}
    </span>
  );
}
