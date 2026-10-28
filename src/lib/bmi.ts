// Semua perhitungan BMI. Murni (tanpa React), dipakai kalkulator dan tabel kategori.
import { lms } from '@/content/cdc-bmi-lms';

export type Sex = 'male' | 'female';
export type Tone = 'under' | 'normal' | 'over' | 'obese';

export const KG_PER_LB = 0.45359237;
export const LB_PER_KG = 1 / KG_PER_LB;
export const CM_PER_IN = 2.54;

/** Warna tiap kelompok, dipakai bar skala, grafik, dan chip. */
export const toneColor: Record<Tone, string> = {
  under: '#dfe6ea',
  normal: '#cfe0d8',
  over: '#f1e6cd',
  obese: '#efd3cb',
};

/** Kategori dewasa WHO. "min" termasuk, "max" tidak (BMI 25.0 = Overweight). Nama tampilan ada di messages (cat.adult.<key>). */
export const adultCategories: {
  key: string;
  min: number;
  max: number;
  tone: Tone;
}[] = [
  { key: 'severeThinness', min: 0, max: 16, tone: 'under' },
  { key: 'moderateThinness', min: 16, max: 17, tone: 'under' },
  { key: 'mildThinness', min: 17, max: 18.5, tone: 'under' },
  { key: 'normal', min: 18.5, max: 25, tone: 'normal' },
  { key: 'overweight', min: 25, max: 30, tone: 'over' },
  { key: 'obese1', min: 30, max: 35, tone: 'obese' },
  { key: 'obese2', min: 35, max: 40, tone: 'obese' },
  { key: 'obese3', min: 40, max: Infinity, tone: 'obese' },
];

/** Kategori anak dan remaja (CDC), berdasarkan persentil BMI menurut umur dan jenis kelamin. Nama dan rentang ada di messages (cat.child.<key>, cat.childRange.<key>). */
export const childCategories: { key: string; tone: Tone }[] = [
  { key: 'underweight', tone: 'under' },
  { key: 'healthy', tone: 'normal' },
  { key: 'atRisk', tone: 'over' },
  { key: 'overweight', tone: 'obese' },
];

export const bmiOf = (kg: number, m: number) => kg / (m * m);

export const adultCategory = (bmi: number) =>
  adultCategories.find((c) => bmi >= c.min && bmi < c.max) ??
  adultCategories[0];

// ---------- Anak dan remaja: metode LMS CDC ----------

type Lms = [number, number, number];

/** L, M, S pada umur tertentu (bulan), interpolasi linear antar baris tabel CDC. */
function lmsAt(sex: Sex, months: number): Lms {
  const rows = lms[sex === 'male' ? 1 : 2];
  const t = Math.min(Math.max(months, rows[0][0]), rows[rows.length - 1][0]);
  const i = rows.findIndex((r) => r[0] >= t);
  if (i <= 0) return [rows[0][1], rows[0][2], rows[0][3]];
  const [a0, L0, M0, S0] = rows[i - 1];
  const [a1, L1, M1, S1] = rows[i];
  const f = (t - a0) / (a1 - a0);
  return [L0 + (L1 - L0) * f, M0 + (M1 - M0) * f, S0 + (S1 - S0) * f];
}

// Umur bulat 12 berarti 12 sampai 13 tahun, jadi dipakai titik tengah tahunnya.
const monthsOf = (ageYears: number) => ageYears * 12 + 6;

/** Fungsi sebaran normal baku (Abramowitz-Stegun 26.2.17, galat < 1e-7). */
function normalCdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

export function childPercentile(bmi: number, sex: Sex, ageYears: number) {
  const [L, M, S] = lmsAt(sex, monthsOf(ageYears));
  const z = L === 0 ? Math.log(bmi / M) / S : ((bmi / M) ** L - 1) / (L * S);
  return normalCdf(z) * 100;
}

const bmiAtZ = ([L, M, S]: Lms, z: number) =>
  L === 0 ? M * Math.exp(S * z) : M * (1 + L * S * z) ** (1 / L);

// z untuk persentil ke-5 dan ke-85
const Z5 = -1.6448536;
const Z85 = 1.0364334;

export function childCategory(percentile: number) {
  if (percentile < 5) return childCategories[0];
  if (percentile < 85) return childCategories[1];
  if (percentile < 95) return childCategories[2];
  return childCategories[3];
}

// ---------- Hasil ----------

export interface Result {
  kind: 'adult' | 'child';
  bmi: number;
  key: string;
  tone: Tone;
  /** Hanya anak dan remaja */
  percentile?: number;
  lowBmi: number;
  highBmi: number;
  lowKg: number;
  highKg: number;
  /** Hanya dewasa */
  prime?: number;
  ponderal?: number;
}

export function calculate(input: {
  age: number;
  sex: Sex;
  kg: number;
  m: number;
}): Result {
  const { age, sex, kg, m } = input;
  const bmi = bmiOf(kg, m);
  const h2 = m * m;
  if (age < 20) {
    const params = lmsAt(sex, monthsOf(age));
    const percentile = childPercentile(bmi, sex, age);
    const c = childCategory(percentile);
    const lowBmi = bmiAtZ(params, Z5);
    const highBmi = bmiAtZ(params, Z85);
    return {
      kind: 'child',
      bmi,
      key: c.key,
      tone: c.tone,
      percentile,
      lowBmi,
      highBmi,
      lowKg: lowBmi * h2,
      highKg: highBmi * h2,
    };
  }
  const c = adultCategory(bmi);
  return {
    kind: 'adult',
    bmi,
    key: c.key,
    tone: c.tone,
    lowBmi: 18.5,
    highBmi: 25,
    lowKg: 18.5 * h2,
    highKg: 25 * h2,
    prime: bmi / 25,
    ponderal: kg / (h2 * m),
  };
}

/** Persentil untuk ditampilkan: nilai bulat, dan penanda untuk di bawah 1 atau di atas 99. */
export function percentileParts(p: number) {
  return {
    n: Math.round(p),
    edge: p < 1 ? 'low' : p > 99 ? 'high' : 'mid',
  } as const;
}
