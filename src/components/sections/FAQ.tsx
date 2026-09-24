import { useTranslations } from 'next-intl';
import { PlusIcon } from '@heroicons/react/24/outline';

/** Also drives the FAQPage structured data on the homepage. */
export const FAQ_KEYS = ['size', 'security', 'payment', 'discount', 'groups', 'account'] as const;

export function FAQ() {
  const t = useTranslations('faq');

  return (
    <section id="faq" className="section-padding bg-paper-50">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-14">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="text-headline mt-4 text-ink-900">{t('title')}</h2>
        </div>

        <div className="divide-y divide-ink-100 border-t border-b border-ink-100">
          {FAQ_KEYS.map((key) => (
            <details key={key} className="group py-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-ink-900">
                {t(`items.${key}.question`)}
                <PlusIcon className="w-4 h-4 flex-shrink-0 text-brand-800 transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-ink-500 leading-relaxed">{t(`items.${key}.answer`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
