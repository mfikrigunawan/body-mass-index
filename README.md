# Body Mass Index

Kalkulator BMI sekaligus halaman referensinya, dibuat sebagai case study untuk [mufigu.com](https://mufigu.com). Masukkan umur, jenis kelamin, tinggi, dan berat badan untuk melihat BMI, kategori, BMI Prime, Ponderal Index, dan rentang berat badan sehat. Tanpa backend, tanpa database, dan tanpa pelacakan.

Dibangun dengan Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis, dan next-intl. Tersedia dalam dua bahasa: Inggris di `/` dan Indonesia di `/id`, dengan pengalih bahasa di header (pola yang sama dengan mufigu.com).

## Yang dihitung

| Metrik         | Rumus                                                        |
| -------------- | ------------------------------------------------------------ |
| BMI (metrik)   | `berat (kg) / tinggi² (m)`                                   |
| BMI (US)       | `703 × berat (lb) / tinggi² (inci)`                          |
| BMI Prime      | `BMI / 25`                                                   |
| Ponderal Index | `berat (kg) / tinggi³ (m)`, ditampilkan dalam kg/m³          |
| Berat sehat    | berat yang menghasilkan BMI 18,5 sampai 25 pada tinggi Anda  |

- **Dewasa (20 tahun ke atas):** kategori WHO, dari Severe Thinness (< 16) sampai Obese Class III (> 40).
- **Anak dan remaja (2-19 tahun):** persentil BMI menurut umur dengan metode LMS CDC, dibandingkan dengan persentil ke-5, ke-85, dan ke-95. Umur bulat dibaca sebagai titik tengah tahun umur tersebut.
- **Satuan lain:** konverter antara feet/inci dan sentimeter, serta pound dan kilogram.

Seluruh perhitungan ada di `src/lib/bmi.ts`.

## Menjalankan di lokal

Butuh Node 24 atau lebih baru dan [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

| Perintah         | Fungsi                                                                             |
| ---------------- | ---------------------------------------------------------------------------------- |
| `pnpm dev`       | Dev server                                                                         |
| `pnpm build`     | Build production                                                                   |
| `pnpm start`     | Jalankan hasil build production                                                    |
| `pnpm lint`      | ESLint                                                                             |
| `pnpm typecheck` | Pemeriksaan tipe TypeScript                                                        |
| `pnpm test:e2e`  | Playwright: halaman termuat, aksesibilitas (axe), perhitungan, dan konversi satuan |

Tes e2e memakai Google Chrome yang sudah terpasang, jadi tidak ada yang diunduh tambahan.

## Struktur penting

```
src/
├── config/site.config.ts       # identitas situs: nama, URL, warna
├── i18n/                       # routing bahasa (en, id) dan konfigurasi next-intl
├── messages/en.json, id.json   # seluruh teks situs per bahasa
├── proxy.ts                    # middleware bahasa (/ = en, /id = id)
├── content/cdc-bmi-lms.ts      # tabel LMS BMI-menurut-umur CDC (umur 24-240,5 bulan)
├── lib/bmi.ts                  # semua rumus BMI dan tabel kategori
├── components/
│   ├── calculator/             # formulir kalkulator dan panel hasil
│   └── sections/               # tabel kategori, grafik, dan bagian artikel
└── app/[locale]/               # halaman, layout, dan 404 per bahasa; robots dan health check di app/
```

## Sumber data

- Kategori dewasa: [World Health Organization](https://www.who.int).
- Anak dan remaja: [CDC growth charts](https://www.cdc.gov/growthcharts/), file data BMI-menurut-umur `bmiagerev.csv`.

## Menambah atau mengubah teks

Semua teks ada di `src/messages/en.json` dan `src/messages/id.json`. Ubah di kedua file dengan kunci yang sama. Untuk menambah bahasa baru, daftarkan di `src/i18n/routing.ts` dan buat file `messages`-nya.

## Disclaimer

Hanya untuk informasi umum. BMI mengukur berat badan terhadap tinggi, bukan lemak tubuh, dan bukan saran medis. Konsultasikan kesehatan Anda dengan tenaga kesehatan.

## Deploy

Sudah ada `Dockerfile` (output standalone Next.js). Situs ini diatur `noindex`; hapus pengaturan robots di `src/app/[locale]/layout.tsx`, `src/app/robots.ts`, dan `next.config.ts` kalau ingin diindeks mesin pencari.

## Lisensi

[MIT](LICENSE)
