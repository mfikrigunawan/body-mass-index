const base = {
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: false,
} as const;
const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const ArrowUpRightIcon = () => (
  <svg {...base} {...line}>
    <path d="M7 17L17 7M8.5 7H17v8.5" />
  </svg>
);
/** Bendera bulat untuk pilihan bahasa (en = Britania Raya, id = Indonesia). Dipotong lingkaran lewat clipPath. */
export function FlagIcon({
  locale,
  className,
}: {
  locale: string;
  className?: string;
}) {
  const clip = `flag-clip-${locale}`;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clip}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {locale === 'id' ? (
          <>
            <rect width="24" height="12" fill="#ce1126" />
            <rect y="12" width="24" height="12" fill="#fff" />
          </>
        ) : (
          <g transform="translate(-12 0) scale(.8)">
            <rect width="60" height="30" fill="#012169" />
            <path d="M0 0L60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
            <path d="M0 0L60 30M60 0L0 30" stroke="#c8102e" strokeWidth="2.4" />
            <path d="M30 0V30M0 15H60" stroke="#fff" strokeWidth="10" />
            <path d="M30 0V30M0 15H60" stroke="#c8102e" strokeWidth="6" />
          </g>
        )}
      </g>
      <circle
        cx="12"
        cy="12"
        r="11.6"
        fill="none"
        stroke="rgba(0,0,0,.18)"
        strokeWidth=".8"
      />
    </svg>
  );
}
