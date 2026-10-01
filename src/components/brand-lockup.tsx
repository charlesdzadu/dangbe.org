/**
 * The DANGBE logo: the wordmark as live text, "dangbe" plus the period. The
 * period is Brique on light and Terre cuite on dark; a `.surface-dark` scope
 * flips it through the tokens by itself, `on="dark"` is for a lockup on a
 * dark object that declares no scope.
 */
export function BrandLockup({
  size = 34,
  className = '',
  on,
}: {
  size?: number;
  className?: string;
  on?: 'dark' | 'light';
}) {
  return (
    <span className={`brand-lockup ${className}`} data-on={on === 'dark' ? 'dark' : undefined}>
      <span className="brand-lockup-word" style={{ fontSize: size * 0.52 }}>
        dangbe
        <span className="brand-lockup-dot">.</span>
      </span>
    </span>
  );
}
