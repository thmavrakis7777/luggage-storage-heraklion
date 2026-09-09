import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { TiltCard } from '@/components/ui/TiltCard';

export function Pricing() {
  const t = useTranslations('pricing');
  const tiers = ['backpack', 'cabin', 'large'] as const;

  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container-wide mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="text-headline mt-4 text-ink-900">{t('title')}</h2>
          <p className="mt-4 text-body-large">{t('subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <TiltCard key={tier} intensity={0.3}>
              <div className="h-full p-8 border border-ink-100 bg-paper-50 text-center">
                <h3 className="text-lg font-medium text-ink-900">{t(`${tier}.name`)}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="font-serif text-4xl font-light text-ink-900">
                    {t(`${tier}.price`)}
                  </span>
                  <span className="text-ink-500 text-sm">{t(`${tier}.unit`)}</span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-10 text-center space-y-2">
          <p className="text-ink-700 font-medium">{t('anySize')}</p>
          <p className="text-ink-500 text-sm">{t('specialRates')}</p>
          <p className="text-brand-900 text-sm font-medium">{t('discountNote')}</p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/book" className="btn-primary">
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
