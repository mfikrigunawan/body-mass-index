import { BmiChart } from '@/components/sections/BmiChart';
import {
  sectionGhost,
  sectionMain,
  sectionTitle,
} from '@/components/ui/styles';
import { adultCategories, childCategories, toneColor } from '@/lib/bmi';

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

const range = (min: number, max: number) =>
  min === 0 ? `< ${max}` : max === Infinity ? `> ${min}` : `${min} - ${max}`;
const primeRange = (min: number, max: number) => range(min / 25, max / 25);

function Formula({
  title,
  children,
  note,
}: {
  title: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="rounded-[10px] border border-line p-6">
      <h3 className="text-[.8rem] font-medium tracking-[.08em] text-muted uppercase">
        {title}
      </h3>
      <p className="mt-3 text-[1.15rem] font-semibold text-black">{children}</p>
      {note && <p className="mt-2 text-[.9rem] text-muted">{note}</p>}
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

export function InfoSections() {
  return (
    <>
      <Block id="about-bmi" ghost="What is" main="BMI">
        <p className={prose}>
          Body Mass Index (BMI) is a measure of body fat based on height and
          weight. It estimates how lean or heavy a person is, and it is a
          general indicator of whether their weight is healthy for their height.
        </p>
        <p className={prose}>
          The categories used to read the number vary by region and age, and
          cutoffs can differ in some countries, such as those in Asia. This
          calculator uses the World Health Organization categories for adults
          and CDC growth charts for children and teens.
        </p>
      </Block>

      <Block id="adult-categories" ghost="Adult" main="BMI Categories">
        <p className={prose}>
          For adults aged 20 and older, BMI is read the same way for men and
          women, using the WHO classification.
        </p>
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Adult BMI categories table"
        >
          <table className="w-full min-w-[30rem] border-collapse text-left">
            <caption className="sr-only">BMI categories for adults</caption>
            <thead>
              <tr>
                <th className={th} scope="col">
                  Classification
                </th>
                <th className={th} scope="col">
                  BMI (kg/m²)
                </th>
                <th className={th} scope="col">
                  BMI Prime
                </th>
              </tr>
            </thead>
            <tbody>
              {adultCategories.map((c) => (
                <tr key={c.label}>
                  <th scope="row" className={`${td} font-semibold text-black`}>
                    <span
                      className="mr-3 inline-block h-3 w-3 rounded-[3px] align-middle"
                      style={{ background: toneColor[c.tone] }}
                      aria-hidden="true"
                    />
                    {c.label}
                  </th>
                  <td className={td}>{range(c.min, c.max)}</td>
                  <td className={td}>{primeRange(c.min, c.max)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BmiChart />
      </Block>

      <Block id="children" ghost="Children &" main="Teens">
        <p className={prose}>
          For ages 2 to 20, BMI is not read from fixed cutoffs. It is compared
          with other children of the same age and sex using CDC BMI-for-age
          percentile charts, because body fat changes as children grow and
          differs between boys and girls.
        </p>
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Children and teens BMI categories table"
        >
          <table className="w-full min-w-[30rem] border-collapse text-left">
            <caption className="sr-only">
              BMI categories for children and teens
            </caption>
            <thead>
              <tr>
                <th className={th} scope="col">
                  Category
                </th>
                <th className={th} scope="col">
                  Percentile range
                </th>
              </tr>
            </thead>
            <tbody>
              {childCategories.map((c) => (
                <tr key={c.label}>
                  <th scope="row" className={`${td} font-semibold text-black`}>
                    <span
                      className="mr-3 inline-block h-3 w-3 rounded-[3px] align-middle"
                      style={{ background: toneColor[c.tone] }}
                      aria-hidden="true"
                    />
                    {c.label}
                  </th>
                  <td className={td}>{c.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      <Block id="formulas" ghost="How it is" main="Calculated">
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 max760:grid-cols-[1fr]">
          <Formula
            title="BMI, metric units"
            note="Weight in kilograms, height in meters."
          >
            BMI = weight (kg) / height² (m)
          </Formula>
          <Formula
            title="BMI, US units"
            note="Weight in pounds, height in inches."
          >
            BMI = 703 × weight (lb) / height² (in)
          </Formula>
          <Formula
            title="BMI Prime"
            note="The ratio of your BMI to 25, the upper limit of the normal range. Below 0.74 is thin, above 1 is overweight."
          >
            BMI Prime = BMI / 25
          </Formula>
          <Formula
            title="Ponderal Index"
            note="Uses height cubed instead of squared, which is more reliable for very tall or very short people. Shown here in kg/m³."
          >
            PI = weight (kg) / height³ (m)
          </Formula>
        </div>
        <p className={prose}>
          Example: a person who is 5&apos;10&quot; (70 inches) and weighs 160 lb
          has BMI = 703 × 160 / 70² = 22.95, which rounds to 23.0 and falls in
          the Normal range. In US units the Ponderal Index is written as height
          (in) / ∛weight (lb), the inverse form, which gives 12.9 for the same
          person.
        </p>
        <p className={prose}>
          The healthy weight range shown in the result is the weight that gives
          a BMI of 18.5 to 25 at your height. For children and teens it uses the
          5th to 85th percentile BMI for their age and sex.
        </p>
      </Block>

      <Block id="risks" ghost="Health" main="Risks">
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 max760:grid-cols-[1fr]">
          <Points
            title="Risks of being overweight"
            items={[
              'High blood pressure',
              'Type II diabetes',
              'Coronary heart disease',
              'Stroke',
              'Certain cancers',
              'Sleep apnea',
              'Higher risk of death overall',
            ]}
          />
          <Points
            title="Risks of being underweight"
            items={[
              'Malnutrition',
              'Osteoporosis',
              'Weakened immune system',
              'Developmental issues in children and teens',
              'Reproductive issues',
              'Higher risk of death overall',
              'It can also be a sign of a condition such as anorexia nervosa',
            ]}
          />
        </div>
      </Block>

      <Block id="limitations" ghost="Limits of" main="BMI">
        <p className={prose}>
          BMI measures weight relative to height, not body fat. It does not
          account for muscle mass, bone density, age, sex or activity level, so
          a muscular person can score as overweight while carrying little fat.
          For roughly 90 to 95 percent of people BMI is a fair indicator of body
          fat, but it should be used alongside other measures and a health
          professional&apos;s advice.
        </p>
        <p className="max-w-[46rem] text-[.9rem] text-muted">
          This calculator is for general information only and is not medical
          advice.
        </p>
      </Block>
    </>
  );
}
