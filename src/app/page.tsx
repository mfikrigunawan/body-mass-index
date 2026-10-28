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

export default function HomePage() {
  return (
    <>
      <PageAnimations />
      <section className={heroSection} aria-labelledby="hero-title">
        <div className="wrap">
          <div className={heroCopy}>
            <BigTitle
              level="h1"
              id="hero-title"
              outline="Body Mass"
              solid="Index"
            />
            <p className={lede} data-intro>
              Enter your age, height and weight to see your BMI, BMI Prime,
              Ponderal Index and the weight range that is healthy for you.
            </p>
            <div className="flex flex-wrap gap-3" data-intro>
              <Button more href="#calculator">
                Calculate BMI
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
            <span className={sectionGhost}>Check your</span>
            <span className={sectionMain}>BMI</span>
          </h2>
          <BmiCalculator />
        </div>
      </section>

      <InfoSections />
    </>
  );
}
