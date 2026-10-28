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
