'use client';

import { useLocale, useTranslations } from 'next-intl';
import { FlagIcon } from '@/components/ui/Icons';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const names: Record<string, string> = { en: 'English', id: 'Bahasa Indonesia' };

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('header');

  return (
    <div
      className="mr-[.35rem] flex items-center rounded-[999px] border border-[#d9d9d9] p-0.5 max-[400px]:mr-0"
      role="group"
      aria-label={t('language')}
    >
      {routing.locales.map((l) => (
        <Link
          key={l}
          className="inline-flex items-center gap-[.35rem] rounded-[999px] px-[.65rem] py-[.22rem] text-[.78rem] font-medium tracking-[.04em] text-[#6b6b6b] transition-colors duration-200 hover:text-brand-primary aria-[current]:bg-brand-primary aria-[current]:text-white max-[400px]:gap-[.25rem] max-[400px]:px-[.4rem]"
          href={pathname}
          locale={l}
          lang={l}
          hrefLang={l}
          aria-current={l === locale ? 'true' : undefined}
          aria-label={t('switchTo', { language: names[l] })}
        >
          <FlagIcon
            className="h-4 w-4 flex-none max-[340px]:hidden"
            locale={l}
          />
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
