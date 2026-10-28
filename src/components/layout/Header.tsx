'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ArrowUpRightIcon } from '@/components/ui/Icons';
import { Logo } from '@/components/ui/Logo';
import {
  logoImg,
  logoLink,
  siteHeader,
  siteHeaderInner,
} from '@/components/ui/styles';
import { siteConfig } from '@/config/site.config';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('header');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        siteHeader,
        scrolled &&
          'bg-[rgba(255,255,255,.88)] backdrop-blur-[12px] backdrop-saturate-[1.4]',
      )}
      data-header
    >
      <div className={siteHeaderInner}>
        <Link
          className={logoLink}
          href="/"
          aria-label={t('homeLabel', { name: siteConfig.name })}
        >
          <Logo className={logoImg} />
          <span className="text-[.8rem] font-semibold tracking-[.22em] text-muted uppercase">
            BMI
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <a
            className="inline-flex items-center gap-1 rounded-[999px] px-3 py-2 text-[.9rem] font-medium text-[#4a4a4a] transition-colors duration-250 hover:text-brand-primary max-[520px]:hidden [&_svg]:h-4 [&_svg]:w-4"
            href={siteConfig.parentUrl}
          >
            mufigu.com
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
    </header>
  );
}
