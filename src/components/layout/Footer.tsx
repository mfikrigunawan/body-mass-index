import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site.config';

export async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="mt-[clamp(3rem,7vw,7rem)] border-t border-line py-8 text-[.85rem] text-muted">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p>{t('disclaimer')}</p>
        <p>
          {t.rich('copy', {
            year: new Date().getFullYear(),
            brand: (chunks) => (
              <a
                className="font-medium text-brand-primary underline underline-offset-[3px]"
                href={siteConfig.parentUrl}
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </footer>
  );
}
