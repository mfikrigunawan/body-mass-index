import { defineRouting } from 'next-intl/routing';

// Bahasa Inggris (default) tetap di "/", Indonesia di "/id". Sama dengan mufigu.com.
export const routing = defineRouting({
  locales: ['en', 'id'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
