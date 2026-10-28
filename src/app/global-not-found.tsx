// 404 global: dipakai untuk URL yang tidak melewati proxy bahasa (mis. /foo.png, /wp-login.php, /api/...).
// Halaman ini melewati layout, jadi font, CSS, dan struktur dasar dibuat ulang di sini. Bahasa tidak diketahui, jadi dua bahasa.
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Logo } from '@/components/ui/Logo';
import { button } from '@/components/ui/button-styles';
import {
  bigInner,
  bigLine,
  bigOutline,
  bigSolid,
  bigTitle,
  heroCopy,
  heroSection,
  lede,
  logoImg,
  logoLink,
  siteHeader,
  siteHeaderInner,
} from '@/components/ui/styles';
import { siteConfig } from '@/config/site.config';
import './globals.css';

const poppins = localFont({
  src: [
    {
      path: '../fonts/poppins-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/poppins-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/poppins-latin-800-normal.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `404 | ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  const brandVars = {
    '--brand-primary': siteConfig.brandColor.primary,
    '--brand-accent': siteConfig.brandColor.accent,
  } as CSSProperties;

  return (
    <html lang="en" className={poppins.variable} style={brandVars}>
      <body className="font-sans antialiased">
        <header className={siteHeader}>
          <div className={siteHeaderInner}>
            <Link
              className={logoLink}
              href="/"
              aria-label={`${siteConfig.name}, home`}
            >
              <Logo className={logoImg} />
            </Link>
          </div>
        </header>
        <main id="main" className="pt-(--header-h)">
          <section className={heroSection}>
            <div className="wrap">
              <div className={heroCopy}>
                <h1 className={bigTitle}>
                  <span className={bigLine}>
                    <span className={`${bigInner} ${bigOutline}`}>
                      Page not
                    </span>
                  </span>{' '}
                  <span className={bigLine}>
                    <span className={`${bigInner} ${bigSolid}`}>found</span>
                  </span>
                </h1>
                <p className={lede}>
                  That page doesn&apos;t exist. <br />
                  Halaman itu tidak ada.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link className={button()} href="/">
                    Back to calculator
                  </Link>
                  <Link className={button({ variant: 'ghost' })} href="/id">
                    Kembali ke kalkulator
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
