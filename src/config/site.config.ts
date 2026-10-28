// FILE UTAMA: identitas situs. Ubah di sini, bukan di komponen.
export const siteConfig = {
  name: 'Body Mass Index',
  description:
    'A BMI calculator by Mufigu: enter your age, height and weight to see your BMI, BMI Prime, Ponderal Index and healthy weight range.',
  url: 'https://bmi.mufigu.com',
  parentUrl: 'https://mufigu.com',
  brandColor: { primary: '#0B0B0B', accent: '#6F8F82' },
  owner: { name: 'Muhammad Fikri Gunawan' },
};

export type SiteConfig = typeof siteConfig;
