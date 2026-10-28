import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { siteConfig } from '@/config/site.config';
import { routing } from '@/i18n/routing';
import '../globals.css';

// Font di-host sendiri (src/fonts), tanpa request ke Google Fonts.
const poppins = localFont({
  src: [
    {
      path: '../../fonts/poppins-latin-300-normal.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../fonts/poppins-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/poppins-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../fonts/poppins-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../fonts/poppins-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../fonts/poppins-latin-800-normal.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Situs pribadi dan case study: tidak perlu SEO, justru jangan diindeks (lihat juga robots.ts).
export async function generateMetadata({
  params,
}: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t('title'), template: `%s · ${t('siteName')}` },
    description: t('description'),
    robots: { index: false, follow: false },
    icons: { icon: '/favicon.svg' },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: siteConfig.brandColor.primary,
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('common');

  const brandVars = {
    '--brand-primary': siteConfig.brandColor.primary,
    '--brand-accent': siteConfig.brandColor.accent,
  } as React.CSSProperties;

  return (
    // suppressHydrationWarning: class "js" ditambahkan oleh skrip kecil di <head> sebelum React hydrate
    <html
      lang={locale}
      className={poppins.variable}
      style={brandVars}
      suppressHydrationWarning
    >
      <head>
        <Script id="js-flag" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
      </head>
      <body id="top" className="font-sans antialiased">
        <NextIntlClientProvider>
          <a
            className="fixed top-[-4rem] left-4 z-200 rounded-lg bg-brand-primary px-[1.1rem] py-[.7rem] text-white [transition:top_.2s] focus:top-4"
            href="#main"
          >
            {t('skip')}
          </a>
          <SmoothScrollProvider>
            <Header />
            <main id="main" className="pt-(--header-h)">
              {children}
            </main>
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
