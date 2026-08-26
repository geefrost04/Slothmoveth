type NavControlIconProps = {
  type: 'account' | 'logout';
};

export function NavControlIcon({ type }: NavControlIconProps) {
  return (
    <span className="nav-control-icon" aria-hidden="true">
      {type === 'account' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4.5 21c1.5-4 4-6 7.5-6s6 2 7.5 6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 5H5v14h5" />
          <path d="m14 8 4 4-4 4M18 12H9" />
        </svg>
      )}
    </span>
  );
}
