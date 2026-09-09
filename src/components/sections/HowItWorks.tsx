import { useTranslations } from 'next-intl';

export function HowItWorks() {
  const t = useTranslations('howItWorks');
  const steps = ['step1', 'step2', 'step3'] as const;

  return (
    <section id="how-it-works" className="section-padding bg-paper-50">
      <div className="container-wide mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="text-headline mt-4 text-ink-900">{t('title')}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {steps.map((key) => (
            <div key={key} className="text-center md:text-left">
              <span className="font-serif text-6xl font-light text-brand-800">
                {t(`${key}.number`)}
              </span>
              <h3 className="mt-4 text-xl font-serif font-medium text-ink-900">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-ink-500 leading-relaxed">{t(`${key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
