import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function FinalCTA() {
  const t = useTranslations('finalCta');

  return (
    <section className="section-padding bg-brand-500">
      <div className="container-wide mx-auto text-center">
        <h2 className="text-headline text-ink-900">{t('title')}</h2>
        <p className="mt-3 text-lg text-ink-800/80">{t('subtitle')}</p>
        <div className="mt-8">
          <Link href="/book" className="btn-dark">
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
