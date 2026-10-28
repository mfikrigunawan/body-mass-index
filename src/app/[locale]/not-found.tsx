import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BigTitle } from '@/components/sections/BigTitle';
import { Button } from '@/components/ui/Button';
import { heroCopy, heroSection, lede } from '@/components/ui/styles';

export const metadata: Metadata = { title: '404' };

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className={heroSection}>
      <div className="wrap">
        <div className={heroCopy}>
          <BigTitle level="h1" outline={t('outline')} solid={t('solid')} />
          <p className={lede}>{t('text')}</p>
          <Button more href="/">
            {t('back')}
          </Button>
        </div>
      </div>
    </section>
  );
}
