import { setRequestLocale, getTranslations, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import type { Metadata, ResolvingMetadata } from 'next';
import { BookingForm } from '@/components/booking/BookingForm';
import { locales } from '@/i18n/config';
import { siteUrl, business } from '@/lib/site';

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ locale: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'booking' });
  const url = `${siteUrl}/${locale}/book`;

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/book`])),
        'x-default': `${siteUrl}/${locales[0]}/book`,
      },
    },
    // Setting openGraph replaces the layout's whole object (it was inheriting
    // the homepage's url/title), so the site name and the per-locale share
    // image are carried over explicitly.
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url,
      siteName: business.name,
      locale,
      type: 'website',
      images: (await parent).openGraph?.images,
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
  const messages = await getMessages();

  return (
    <section className="section-padding pt-28 md:pt-32 bg-paper-50 min-h-screen">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-10">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className="text-headline mt-4 text-ink-900">{t('title')}</h1>
          <p className="mt-3 text-ink-500">{t('subtitle')}</p>
        </div>

        <div className="bg-white shadow-xl p-6 sm:p-10">
          {/* The booking copy is only needed in the browser on this page. */}
          <NextIntlClientProvider messages={{ booking: messages.booking }}>
            <BookingForm />
          </NextIntlClientProvider>
        </div>
      </div>
    </section>
  );
}
