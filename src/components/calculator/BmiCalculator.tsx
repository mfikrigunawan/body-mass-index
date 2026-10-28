'use client';

import { useId, useState, type ComponentProps } from 'react';
import { Button } from '@/components/ui/Button';
import {
  adultCategories,
  calculate,
  CM_PER_IN,
  KG_PER_LB,
  LB_PER_KG,
  ordinal,
  toneColor,
  type Result,
  type Sex,
  type Tone,
} from '@/lib/bmi';
import { cn } from '@/lib/utils';

type Tab = 'us' | 'metric' | 'other';
const tabs: { id: Tab; label: string }[] = [
  { id: 'us', label: 'US units' },
  { id: 'metric', label: 'Metric units' },
  { id: 'other', label: 'Other units' },
];

const fieldLabel =
  'text-[.8rem] font-medium tracking-[.08em] text-muted uppercase';
const inputClass =
  'w-full rounded-[10px] border border-[#cfcfcf] bg-white px-4 py-3 text-[1rem] text-black';

const num = (v: FormDataEntryValue | null) => {
  const n = parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : NaN;
};
const fmt = (n: number, d = 1) => n.toFixed(d);
const round1 = (n: number) => String(Math.round(n * 10) / 10);

function Field({
  label,
  ...rest
}: { label: string } & Omit<ComponentProps<'input'>, 'id'>) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step="any"
        className={inputClass}
        {...rest}
      />
    </div>
  );
}

export function BmiCalculator() {
  const [tab, setTab] = useState<Tab>('us');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  function switchTab(next: Tab) {
    setTab(next);
    setResult(null);
    setError('');
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const age = num(fd.get('age'));
    const sex: Sex = fd.get('sex') === 'female' ? 'female' : 'male';
    let cm: number;
    let kg: number;
    if (tab === 'us') {
      cm = (num(fd.get('ft')) * 12 + (num(fd.get('in')) || 0)) * CM_PER_IN;
      kg = num(fd.get('lb')) * KG_PER_LB;
    } else {
      cm = num(fd.get('cm'));
      kg = num(fd.get('kg'));
    }

    const problem =
      !Number.isInteger(age) || age < 2 || age > 120
        ? 'Age must be a whole number from 2 to 120.'
        : !(cm >= 50 && cm <= 272)
          ? 'Please enter a valid height.'
          : !(kg >= 2 && kg <= 650)
            ? 'Please enter a valid weight.'
            : '';
    setError(problem);
    setResult(problem ? null : calculate({ age, sex, kg, m: cm / 100 }));
  }

  return (
    <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] items-start gap-[clamp(1rem,2vw,2rem)] max1024:grid-cols-[1fr]">
      <div className="rounded-[10px] border border-line p-[clamp(1.25rem,2.5vw,2.25rem)]">
        <div
          className="mb-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Units"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tab === t.id}
              onClick={() => switchTab(t.id)}
              className={cn(
                'rounded-[999px] border-[1.5px] border-brand-primary px-5 py-2 text-[.9rem] font-semibold transition-colors duration-250',
                tab === t.id
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-primary hover:bg-chip',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'other' ? (
          <Converter />
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-5">
            <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 max640:grid-cols-[1fr]">
              <Field label="Age (2 - 120)" name="age" defaultValue={25} />
              <fieldset className="grid gap-1.5">
                <legend className={cn(fieldLabel, 'mb-1.5')}>Gender</legend>
                <div className="flex gap-2">
                  {(['male', 'female'] as const).map((s) => (
                    <label key={s} className="flex-1">
                      <input
                        type="radio"
                        name="sex"
                        value={s}
                        defaultChecked={s === 'male'}
                        className="peer sr-only"
                      />
                      <span className="block cursor-pointer rounded-[10px] border border-[#cfcfcf] py-3 text-center capitalize transition-colors duration-250 peer-checked:border-brand-primary peer-checked:bg-brand-primary peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-(--focus)">
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {tab === 'us' ? (
              <>
                <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4">
                  <Field label="Height (feet)" name="ft" defaultValue={5} />
                  <Field label="Height (inches)" name="in" defaultValue={10} />
                </div>
                <Field label="Weight (pounds)" name="lb" defaultValue={160} />
              </>
            ) : (
              <>
                <Field label="Height (cm)" name="cm" defaultValue={178} />
                <Field label="Weight (kg)" name="kg" defaultValue={72} />
              </>
            )}

            {error && (
              <p
                role="alert"
                className="text-[.95rem] font-medium text-[#b42318]"
              >
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" more>
                Calculate
                <ArrowIcon />
              </Button>
              <Button
                type="reset"
                variant="ghost"
                onClick={() => {
                  setResult(null);
                  setError('');
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        )}
      </div>

      <div aria-live="polite">
        {result ? (
          <ResultPanel r={result} us={tab === 'us'} />
        ) : (
          <div className="rounded-[10px] border border-dashed border-[#cfcfcf] p-[clamp(1.25rem,2.5vw,2.25rem)] text-muted">
            {tab === 'other'
              ? 'Convert between feet/inches and centimeters, or pounds and kilograms, then use the result in the other tabs.'
              : 'Enter your details and press Calculate to see your BMI.'}
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Converter() {
  const [v, setV] = useState({
    ft: '5',
    inch: '10',
    cm: '177.8',
    lb: '160',
    kg: '72.6',
  });

  const setHeightImp = (ft: string, inch: string) =>
    setV((o) => ({
      ...o,
      ft,
      inch,
      cm:
        ft === '' && inch === ''
          ? ''
          : round1(((+ft || 0) * 12 + (+inch || 0)) * CM_PER_IN),
    }));
  const setCm = (cm: string) => {
    if (cm === '') return setV((o) => ({ ...o, cm, ft: '', inch: '' }));
    const total = Math.round((+cm / CM_PER_IN) * 10) / 10;
    const ft = Math.floor(total / 12);
    setV((o) => ({ ...o, cm, ft: String(ft), inch: round1(total - ft * 12) }));
  };

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-4 max640:grid-cols-[repeat(2,minmax(0,1fr))]">
        <Field
          label="Feet"
          value={v.ft}
          onChange={(e) => setHeightImp(e.target.value, v.inch)}
        />
        <Field
          label="Inches"
          value={v.inch}
          onChange={(e) => setHeightImp(v.ft, e.target.value)}
        />
        <Field
          label="Centimeters"
          value={v.cm}
          onChange={(e) => setCm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4">
        <Field
          label="Pounds"
          value={v.lb}
          onChange={(e) =>
            setV((o) => ({
              ...o,
              lb: e.target.value,
              kg:
                e.target.value === ''
                  ? ''
                  : round1(+e.target.value * KG_PER_LB),
            }))
          }
        />
        <Field
          label="Kilograms"
          value={v.kg}
          onChange={(e) =>
            setV((o) => ({
              ...o,
              kg: e.target.value,
              lb:
                e.target.value === ''
                  ? ''
                  : round1(+e.target.value * LB_PER_KG),
            }))
          }
        />
      </div>
    </div>
  );
}

/** Bar skala berwarna dengan penanda posisi (0-100%). */
function Scale({
  segments,
  pos,
}: {
  segments: { w: number; tone: Tone }[];
  pos: number;
}) {
  return (
    <div className="relative mt-2 mb-1" aria-hidden="true">
      <div className="flex h-2 gap-[2px] overflow-hidden rounded-[999px]">
        {segments.map((s, i) => (
          <span
            key={i}
            style={{ width: `${s.w}%`, background: toneColor[s.tone] }}
          />
        ))}
      </div>
      <span
        className="absolute -top-1.5 h-5 w-[3px] -translate-x-1/2 rounded-[2px] bg-white shadow-[0_0_0_1.5px_#0b0b0b]"
        style={{ left: `${pos}%` }}
      />
    </div>
  );
}

const SCALE_MIN = 10;
const SCALE_MAX = 45;
const adultSegments = adultCategories.map((c) => ({
  tone: c.tone,
  w:
    ((Math.min(c.max, SCALE_MAX) - Math.max(c.min, SCALE_MIN)) /
      (SCALE_MAX - SCALE_MIN)) *
    100,
}));
const childSegments: { w: number; tone: Tone }[] = [
  { w: 5, tone: 'under' },
  { w: 80, tone: 'normal' },
  { w: 10, tone: 'over' },
  { w: 5, tone: 'obese' },
];

function ResultPanel({ r, us }: { r: Result; us: boolean }) {
  const w = (kg: number) =>
    us ? `${fmt(kg * LB_PER_KG)} lbs` : `${fmt(kg)} kg`;
  const pos =
    r.kind === 'child'
      ? r.percentile!
      : ((Math.min(Math.max(r.bmi, SCALE_MIN), SCALE_MAX) - SCALE_MIN) /
          (SCALE_MAX - SCALE_MIN)) *
        100;

  const rows: [string, string][] =
    r.kind === 'child'
      ? [
          ['BMI-for-age percentile', ordinal(r.percentile!)],
          [
            'Healthy BMI range for age',
            `${fmt(r.lowBmi)} - ${fmt(r.highBmi)} kg/m²`,
          ],
          ['Healthy weight for the height', `${w(r.lowKg)} - ${w(r.highKg)}`],
        ]
      : [
          ['Healthy BMI range', '18.5 kg/m² - 25 kg/m²'],
          ['Healthy weight for the height', `${w(r.lowKg)} - ${w(r.highKg)}`],
          ['BMI Prime', fmt(r.prime!, 2)],
          ['Ponderal Index', `${fmt(r.ponderal!)} kg/m³`],
        ];

  return (
    <div className="rounded-[10px] bg-brand-primary p-[clamp(1.25rem,2.5vw,2.25rem)] text-white">
      <p className="text-[.8rem] font-medium tracking-[.08em] text-[#bdbdbd] uppercase">
        Your result
      </p>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[length:clamp(3rem,6vw,5rem)] leading-none font-extrabold tracking-[-.04em]">
          BMI = {fmt(r.bmi)}
        </span>
        <span className="text-[1rem] text-[#bdbdbd]">kg/m²</span>
      </p>
      <p
        className="mt-3 inline-block rounded-[999px] px-4 py-1 text-[.95rem] font-semibold text-black"
        style={{ background: toneColor[r.tone] }}
      >
        {r.label}
      </p>
      <Scale
        segments={r.kind === 'child' ? childSegments : adultSegments}
        pos={pos}
      />
      <dl className="mt-6 grid divide-y divide-white/15 border-t border-white/15">
        {rows.map(([k, val]) => (
          <div
            key={k}
            className="flex flex-wrap items-baseline justify-between gap-x-4 py-3"
          >
            <dt className="text-[#bdbdbd]">{k}</dt>
            <dd className="font-semibold">{val}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
