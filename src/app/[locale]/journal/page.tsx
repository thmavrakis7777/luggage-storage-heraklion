import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { siteUrl } from '@/lib/site';
import {
  getAllPosts,
  isJournalLocale,
  journalLanguageAlternates,
  readingMinutes,
} from '@/content/journal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isJournalLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'journal' });
  const url = `${siteUrl}/${locale}/journal`;

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: url,
      languages: journalLanguageAlternates('/journal'),
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url,
      type: 'website',
      locale,
    },
  };
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isJournalLocale(locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'journal' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const posts = getAllPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t('title'),
    description: t('subtitle'),
    url: `${siteUrl}/${locale}/journal`,
    inLanguage: locale,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.content[locale].title,
      description: post.content[locale].description,
      datePublished: post.publishedAt,
      url: `${siteUrl}/${locale}/journal/${post.slug}`,
    })),
  };

  return (
    <section className="section-padding pt-28 md:pt-32 bg-paper-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-narrow mx-auto">
        <div className="text-center mb-14">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className="text-headline mt-4 text-ink-900">{t('title')}</h1>
          <p className="mt-4 text-body-large max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="divide-y divide-ink-100 border-t border-b border-ink-100">
          {posts.map((post) => {
            const content = post.content[locale];
            return (
              <article key={post.slug} className="py-8">
                <Link href={`/journal/${post.slug}`} className="group block">
                  <p className="text-xs font-medium tracking-wider text-ink-400 uppercase">
                    {t('readingTime', { minutes: readingMinutes(content.body) })}
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-light text-ink-900 group-hover:text-brand-900 transition-colors">
                    {content.title}
                  </h2>
                  <p className="mt-3 text-ink-500 leading-relaxed">{content.description}</p>
                  <span className="mt-4 inline-block text-sm font-medium tracking-wide text-brand-900">
                    {t('readMore')} →
                  </span>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-14 bg-white shadow-xl p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-serif font-light text-ink-900">{t('ctaTitle')}</h2>
          <p className="mt-3 text-ink-500">{t('ctaText')}</p>
          <Link href="/book" className="btn-primary mt-6 inline-flex">
            {tNav('bookNow')}
          </Link>
        </div>
      </div>
    </section>
  );
}
