// Angka mengikuti bahasa halaman: "23.0" di en, "23,0" di id.
export const nf = (locale: string, n: number, digits = 1) =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);

/** Tanpa nol di belakang (18,5 / 25), untuk batas kategori. */
export const nfa = (locale: string, n: number) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(n);
