import { getLocale, getTranslations } from 'next-intl/server';
import { BmiChart } from '@/components/sections/BmiChart';
import {
  sectionGhost,
  sectionMain,
  sectionTitle,
} from '@/components/ui/styles';
import { adultCategories, childCategories, toneColor } from '@/lib/bmi';
import { nfa } from '@/lib/format';

const prose = 'max-w-[46rem] text-[1.05rem] leading-relaxed text-body';
const th =
  'py-3 pr-4 text-left text-[.8rem] font-medium tracking-[.08em] text-muted uppercase';
const td = 'py-3 pr-4 border-t border-line';

function Block({
  id,
  ghost,
  main,
  children,
}: {
  id: string;
  ghost: string;
  main: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section pt-0" aria-labelledby={`${id}-title`} id={id}>
      <div className="wrap">
        <h2 className={sectionTitle} id={`${id}-title`} data-title>
          <span className={sectionGhost}>{ghost}</span>
          <span className={sectionMain}>{main}</span>
        </h2>
        <div className="grid gap-6" data-reveal>
          {children}
        </div>
      </div>
    </section>
  );
}

function Formula({
  title,
  formula,
  note,
}: {
  title: string;
  formula: string;
  note: string;
}) {
  return (
    <div className="rounded-[10px] border border-line p-6">
      <h3 className="text-[.8rem] font-medium tracking-[.08em] text-muted uppercase">
        {title}
      </h3>
      <p className="mt-3 text-[1.15rem] font-semibold text-black">{formula}</p>
      <p className="mt-2 text-[.9rem] text-muted">{note}</p>
    </div>
  );
}

function Points({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[10px] border border-line p-6">
      <h3 className="mb-3 text-[1.1rem] font-bold text-black">{title}</h3>
      <ul className="grid gap-2 text-body">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span
              className="mt-[.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent"
              aria-hidden="true"
            />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Swatch({ tone }: { tone: keyof typeof toneColor }) {
  return (
    <span
      className="mr-3 inline-block h-3 w-3 rounded-[3px] align-middle"
      style={{ background: toneColor[tone] }}
      aria-hidden="true"
    />
  );
}

export async function InfoSections() {
  const t = await getTranslations('info');
  const tc = await getTranslations('cat');
  const locale = await getLocale();

  const n = (v: number) => nfa(locale, v);
  const range = (min: number, max: number) =>
    min === 0
      ? `< ${n(max)}`
      : max === Infinity
        ? `> ${n(min)}`
        : `${n(min)} - ${n(max)}`;

  return (
    <>
      <Block id="about-bmi" ghost={t('about.ghost')} main={t('about.main')}>
        <p className={prose}>{t('about.p1')}</p>
        <p className={prose}>{t('about.p2')}</p>
      </Block>

      <Block
        id="adult-categories"
        ghost={t('adult.ghost')}
        main={t('adult.main')}
      >
        <p className={prose}>{t('adult.intro')}</p>
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label={t('adult.aria')}
        >
          <table className="w-full min-w-[30rem] border-collapse text-left">
            <caption className="sr-only">{t('adult.caption')}</caption>
            <thead>
              <tr>
                <th className={th} scope="col">
                  {t('adult.colClass')}
                </th>
                <th className={th} scope="col">
                  {t('adult.colBmi')}
                </th>
                <th className={th} scope="col">
                  {t('adult.colPrime')}
                </th>
              </tr>
            </thead>
            <tbody>
              {adultCategories.map((c) => (
                <tr key={c.key}>
                  <th scope="row" className={`${td} font-semibold text-black`}>
                    <Swatch tone={c.tone} />
                    {tc(`adult.${c.key}`)}
                  </th>
                  <td className={td}>{range(c.min, c.max)}</td>
                  <td className={td}>{range(c.min / 25, c.max / 25)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BmiChart />
      </Block>

      <Block
        id="children"
        ghost={t('children.ghost')}
        main={t('children.main')}
      >
        <p className={prose}>{t('children.intro')}</p>
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label={t('children.aria')}
        >
          <table className="w-full min-w-[30rem] border-collapse text-left">
            <caption className="sr-only">{t('children.caption')}</caption>
            <thead>
              <tr>
                <th className={th} scope="col">
                  {t('children.colCategory')}
                </th>
                <th className={th} scope="col">
                  {t('children.colRange')}
                </th>
              </tr>
            </thead>
            <tbody>
              {childCategories.map((c) => (
                <tr key={c.key}>
                  <th scope="row" className={`${td} font-semibold text-black`}>
                    <Swatch tone={c.tone} />
                    {tc(`child.${c.key}`)}
                  </th>
                  <td className={td}>{tc(`childRange.${c.key}`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      <Block
        id="formulas"
        ghost={t('formulas.ghost')}
        main={t('formulas.main')}
      >
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 max760:grid-cols-[1fr]">
          {(['bmiMetric', 'bmiUs', 'prime', 'ponderal'] as const).map((k) => (
            <Formula
              key={k}
              title={t(`formulas.${k}.title`)}
              formula={t(`formulas.${k}.formula`)}
              note={t(`formulas.${k}.note`)}
            />
          ))}
        </div>
        <p className={prose}>{t('formulas.example')}</p>
        <p className={prose}>{t('formulas.healthy')}</p>
      </Block>

      <Block id="risks" ghost={t('risks.ghost')} main={t('risks.main')}>
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 max760:grid-cols-[1fr]">
          <Points
            title={t('risks.overTitle')}
            items={t.raw('risks.overItems') as string[]}
          />
          <Points
            title={t('risks.underTitle')}
            items={t.raw('risks.underItems') as string[]}
          />
        </div>
      </Block>

      <Block id="limitations" ghost={t('limits.ghost')} main={t('limits.main')}>
        <p className={prose}>{t('limits.p1')}</p>
        <p className="max-w-[46rem] text-[.9rem] text-muted">
          {t('limits.disclaimer')}
        </p>
      </Block>
    </>
  );
}
