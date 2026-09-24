import { useTranslations } from 'next-intl';
import { business } from '@/lib/site';
import { OPENING_HOURS_DISPLAY } from '@/lib/hours';
import { formatEuros, LUGGAGE_SIZES, PRICE_PER_DAY_CENTS } from '@/lib/pricing';

/** The facts search engines and AI assistants are most likely to quote, as
 * plain text. Prices, hours and distances come from the same sources as the
 * rest of the site, so this box can't drift out of date on its own. */
export function KeyFacts() {
  const t = useTranslations('facts');
  const tLocation = useTranslations('location');
  const tHours = useTranslations('hours');
  const tPricing = useTranslations('pricing');
  const prices = Object.values(PRICE_PER_DAY_CENTS);
  const distanceKeys = ['cathedral', 'busStation', 'lions', 'port', 'airport'] as const;

  const facts = [
    {
      label: tLocation('addressLabel'),
      value: `${business.streetAddress}, ${business.postalCode} ${business.addressLocality}, ${business.addressRegion}, Greece`,
    },
    {
      label: tLocation('hoursLabel'),
      value: `${OPENING_HOURS_DISPLAY.map(({ labelKey, open, close }) => `${tHours(labelKey)} ${open}–${close}`).join('; ')}. ${tHours('advanceBookingNote')}`,
    },
    {
      label: t('labels.prices'),
      value: t('prices', {
        items: LUGGAGE_SIZES.map((size) => `${tPricing(`${size}.name`)} ${formatEuros(PRICE_PER_DAY_CENTS[size])}`).join(' · '),
      }),
    },
    { label: t('labels.discounts'), value: tPricing('discountNote') },
    { label: t('labels.payment'), value: t('payment') },
    { label: t('labels.booking'), value: t('booking') },
    { label: t('labels.security'), value: t('security') },
    { label: t('labels.luggage'), value: t('luggage') },
    { label: t('labels.nearby'), value: distanceKeys.map((key) => tLocation(`distances.${key}`)).join('; ') },
    { label: t('labels.extras'), value: t('extras') },
  ];

  return (
    <section id="facts" className="section-padding bg-white">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="text-headline mt-4 text-ink-900">{t('title')}</h2>
          <p className="mt-4 text-body-large max-w-2xl mx-auto">
            {t('summary', {
              name: business.name,
              min: formatEuros(Math.min(...prices)),
              max: formatEuros(Math.max(...prices)),
            })}
          </p>
        </div>

        <dl className="divide-y divide-ink-100 border-t border-b border-ink-100">
          {facts.map(({ label, value }) => (
            <div key={label} className="grid sm:grid-cols-[11rem_1fr] gap-x-8 gap-y-1 py-4">
              <dt className="text-xs font-medium tracking-wider uppercase text-ink-500 sm:pt-1">{label}</dt>
              <dd className="text-ink-700 leading-relaxed">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
