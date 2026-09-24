import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { siteUrl, business } from '@/lib/site';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { isJournalLocale, journalLanguageAlternates, JOURNAL_LOCALES } from '@/content/journal';
import { privacy, PRIVACY_UPDATED } from '@/content/privacy';
import { Prose } from '@/components/ui/Prose';

// Written in the journal's two languages; the other five link to English.
export function generateStaticParams() {
  return JOURNAL_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale } = await params;
  if (!isJournalLocale(locale)) return {};

  const { title, description } = privacy[locale];
  const url = `${siteUrl}/${locale}/privacy`;

  return {
    title,
    description,
    alternates: { canonical: url, languages: journalLanguageAlternates('/privacy') },
    openGraph: {
      title,
      description,
      url,
      siteName: business.name,
      type: 'website',
      locale,
      images: (await parent).openGraph?.images,
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isJournalLocale(locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'journal' });
  const content = privacy[locale];
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${PRIVACY_UPDATED}T00:00:00Z`)
  );

  return (
    <section className="section-padding pt-28 md:pt-32 bg-paper-50">
      <div className="container-narrow">
        <article>
          <header>
            <h1 className="text-4xl sm:text-5xl font-serif font-light leading-tight text-ink-900">
              {content.title}
            </h1>
            <p className="mt-4 text-xs font-medium tracking-wider text-ink-400 uppercase">
              <time dateTime={PRIVACY_UPDATED}>{t('updated', { date: updated })}</time>
            </p>
          </header>

          <div className="mt-8 border-t border-ink-100 pt-2">
            <Prose blocks={[...content.body, ...(GA_MEASUREMENT_ID ? content.analytics : []), ...content.closing]} />
          </div>
        </article>
      </div>
    </section>
  );
}
