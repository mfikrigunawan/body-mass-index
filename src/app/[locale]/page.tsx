import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BmiCalculator } from '@/components/calculator/BmiCalculator';
import { PageAnimations } from '@/components/motion/PageAnimations';
import { BigTitle } from '@/components/sections/BigTitle';
import { InfoSections } from '@/components/sections/InfoSections';
import { Button } from '@/components/ui/Button';
import {
  heroCopy,
  heroSection,
  lede,
  sectionGhost,
  sectionMain,
  sectionTitle,
} from '@/components/ui/styles';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageAnimations />
      <section className={heroSection} aria-labelledby="hero-title">
        <div className="wrap">
          <div className={heroCopy}>
            <BigTitle
              level="h1"
              id="hero-title"
              outline={t('hero.outline')}
              solid={t('hero.solid')}
            />
            <p className={lede} data-intro>
              {t('hero.lede')}
            </p>
            <div className="flex flex-wrap gap-3" data-intro>
              <Button more href="#calculator">
                {t('hero.cta')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section pt-0"
        id="calculator"
        aria-labelledby="calculator-title"
      >
        <div className="wrap">
          <h2 className={sectionTitle} id="calculator-title" data-title>
            <span className={sectionGhost}>{t('calc.ghost')}</span>
            <span className={sectionMain}>{t('calc.main')}</span>
          </h2>
          <BmiCalculator />
        </div>
      </section>

      <InfoSections />
    </>
  );
}
