import { useTranslations } from 'next-intl';
import { TruckIcon } from '@heroicons/react/24/outline';
import { whatsappHref } from '@/lib/site';

export function AirportTransfer() {
  const t = useTranslations('transfer');

  return (
    <section className="section-padding bg-ink-900">
      <div className="container-wide mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex w-14 h-14 items-center justify-center bg-brand-500/15 mb-6">
            <TruckIcon className="w-7 h-7 text-brand-400" />
          </div>
          <span className="eyebrow text-brand-400">{t('eyebrow')}</span>
          <h2 className="text-headline mt-4 text-white">{t('title')}</h2>
          <p className="mt-4 text-lg text-white/70">{t('description')}</p>
          <div className="mt-8">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              {t('cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
