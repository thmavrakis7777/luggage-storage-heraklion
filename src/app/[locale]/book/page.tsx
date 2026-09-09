import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BookingForm } from '@/components/booking/BookingForm';
import { locales } from '@/i18n/config';
import { siteUrl } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'booking' });

  return {
    title: t('title'),
    alternates: {
      canonical: `${siteUrl}/${locale}/book`,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/book`])),
    },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'booking' });

  return (
    <section className="section-padding pt-28 md:pt-32 bg-paper-50 min-h-screen">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-10">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className="text-headline mt-4 text-ink-900">{t('title')}</h1>
          <p className="mt-3 text-ink-500">{t('subtitle')}</p>
        </div>

        <div className="bg-white shadow-xl p-6 sm:p-10">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
