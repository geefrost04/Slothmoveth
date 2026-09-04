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
        <linearGradient id="smGradBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="smEarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="smHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Squircle Badge */}
      <rect x="4" y="4" width="112" height="112" rx="34" fill="url(#smGradBg)" />
      <rect x="4" y="4" width="112" height="112" rx="34" fill="url(#smHighlight)" />
      <rect x="4" y="4" width="112" height="112" rx="34" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.25" />

      {/* Ears */}
      <circle cx="28" cy="38" r="13" fill="url(#smEarGrad)" />
      <circle cx="28" cy="38" r="7" fill="#334155" />
      <circle cx="92" cy="38" r="13" fill="url(#smEarGrad)" />
      <circle cx="92" cy="38" r="7" fill="#334155" />

      {/* Sloth Head Base */}
      <ellipse cx="60" cy="62" rx="42" ry="38" fill="#1e293b" />

      {/* Face Mask */}
      <path d="M 32 64 C 32 46 44 38 60 38 C 76 38 88 46 88 64 C 88 80 76 88 60 88 C 44 88 32 80 32 64 Z" fill="#ffffff" />

      {/* Eye Patches */}
      <path d="M 36 60 C 34 50 43 45 49 53 C 54 59 47 73 39 71 C 35 70 37 65 36 60 Z" fill="#0f172a" />
      <path d="M 84 60 C 86 50 77 45 71 53 C 66 59 73 73 81 71 C 85 70 83 65 84 60 Z" fill="#0f172a" />

      {/* Focused, Friendly Eyes */}
      <circle cx="43" cy="59" r="4.5" fill="#ffffff" />
      <circle cx="43" cy="59" r="2.8" fill="#0f172a" />
      <circle cx="44.5" cy="57.5" r="1.3" fill="#ffffff" />

      <circle cx="77" cy="59" r="4.5" fill="#ffffff" />
      <circle cx="77" cy="59" r="2.8" fill="#0f172a" />
      <circle cx="78.5" cy="57.5" r="1.3" fill="#ffffff" />

      {/* Snout / Nose */}
      <ellipse cx="60" cy="69" rx="7.5" ry="5" fill="#0f172a" />
      <ellipse cx="60" cy="68" rx="2.5" ry="1.2" fill="#334155" opacity="0.6" />

      {/* Smile */}
      <path d="M 53 76 Q 60 82 67 76" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cheeks */}
      <circle cx="36" cy="74" r="3.5" fill="#f43f5e" opacity="0.25" />
      <circle cx="84" cy="74" r="3.5" fill="#f43f5e" opacity="0.25" />

      {/* Growth Sprout / Forward Momentum Accent */}
      <path d="M 60 22 C 58 14 67 11 69 18 C 70 23 64 26 60 22 Z" fill="#fbbf24" />
      <path d="M 60 22 C 54 16 51 22 55 26 C 58 28 61 25 60 22 Z" fill="#34d399" />
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
