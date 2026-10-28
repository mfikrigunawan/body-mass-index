import { toneColor, type Tone } from '@/lib/bmi';

// Grafik tinggi-berat dengan garis BMI (SVG statis, dibuat di server).
const W = 760;
const H = 440;
const m = { l: 56, r: 44, t: 16, b: 48 };
const [h0, h1] = [140, 210]; // tinggi, cm
const [w0, w1] = [30, 180]; // berat, kg
const x = (h: number) => m.l + ((h - h0) / (h1 - h0)) * (W - m.l - m.r);
const y = (w: number) => H - m.b - ((w - w0) / (w1 - w0)) * (H - m.t - m.b);

const heights = Array.from({ length: 15 }, (_, i) => h0 + i * 5);
const weightAt = (bmi: number, h: number) => bmi * (h / 100) ** 2;
const line = (bmi: number) =>
  heights
    .map(
      (h, i) =>
        `${i ? 'L' : 'M'}${x(h).toFixed(1)} ${y(weightAt(bmi, h)).toFixed(1)}`,
    )
    .join(' ');

// Pita antar dua garis BMI (batas bawah/atas), dipotong clipPath.
const band = (from: number, to: number) =>
  `${line(from)} ${[...heights]
    .reverse()
    .map((h) => `L${x(h).toFixed(1)} ${y(weightAt(to, h)).toFixed(1)}`)
    .join(' ')} Z`;

const bands: { label: string; from: number; to: number; tone: Tone }[] = [
  { label: 'Underweight', from: 0, to: 18.5, tone: 'under' },
  { label: 'Normal', from: 18.5, to: 25, tone: 'normal' },
  { label: 'Overweight', from: 25, to: 30, tone: 'over' },
  { label: 'Obese', from: 30, to: 99, tone: 'obese' },
];
const lines = [16, 17, 18.5, 25, 30, 35, 40];

export function BmiChart() {
  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Chart of weight against height with lines for BMI 16, 17, 18.5, 25, 30, 35 and 40"
      >
        <defs>
          <clipPath id="plot">
            <rect
              x={m.l}
              y={m.t}
              width={W - m.l - m.r}
              height={H - m.t - m.b}
            />
          </clipPath>
        </defs>
        <g clipPath="url(#plot)">
          {bands.map((b) => (
            <path
              key={b.label}
              d={band(b.from, b.to)}
              fill={toneColor[b.tone]}
            />
          ))}
          {lines.map((b) => (
            <path
              key={b}
              d={line(b)}
              fill="none"
              stroke="#fff"
              strokeWidth={1.5}
            />
          ))}
        </g>
        {lines.map((b) => (
          <text
            key={b}
            x={x(h1) + 6}
            y={y(weightAt(b, h1)) + 4}
            fontSize={12}
            fill="#5f6368"
          >
            {b}
          </text>
        ))}
        {[140, 150, 160, 170, 180, 190, 200, 210].map((h) => (
          <text
            key={h}
            x={x(h)}
            y={H - m.b + 20}
            fontSize={12}
            textAnchor="middle"
            fill="#5f6368"
          >
            {h}
          </text>
        ))}
        {[40, 60, 80, 100, 120, 140, 160, 180].map((w) => (
          <text
            key={w}
            x={m.l - 8}
            y={y(w) + 4}
            fontSize={12}
            textAnchor="end"
            fill="#5f6368"
          >
            {w}
          </text>
        ))}
        <text
          x={(W + m.l - m.r) / 2}
          y={H - 8}
          fontSize={12}
          textAnchor="middle"
          fill="#262626"
        >
          Height (cm)
        </text>
        <text
          transform={`translate(14 ${H / 2}) rotate(-90)`}
          fontSize={12}
          textAnchor="middle"
          fill="#262626"
        >
          Weight (kg)
        </text>
      </svg>
      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[.85rem] text-muted">
        {bands.map((b) => (
          <span key={b.label} className="inline-flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-[3px]"
              style={{ background: toneColor[b.tone] }}
              aria-hidden="true"
            />
            {b.label}
          </span>
        ))}
        <span>Lines show BMI values (kg/m²).</span>
      </figcaption>
    </figure>
  );
}
