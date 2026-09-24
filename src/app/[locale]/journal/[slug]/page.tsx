import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { siteUrl, business } from '@/lib/site';
import {
  getAllPosts,
  getPost,
  getRelatedPosts,
  isJournalLocale,
  journalLanguageAlternates,
  lastModified,
  readingMinutes,
  JOURNAL_AUTHOR,
  JOURNAL_LOCALES,
} from '@/content/journal';
import { Prose } from '@/components/ui/Prose';

/** Both params are generated here so the journal's 2 languages don't get
 * crossed with the site's other 5 — with dynamicParams off, that also makes
 * /de/journal/<slug> a 404 rather than a thin English-fallback page. */
export function generateStaticParams() {
  return JOURNAL_LOCALES.flatMap((locale) =>
    getAllPosts().map((post) => ({ locale, slug: post.slug }))
  );
}

export const dynamicParams = false;

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ locale: string; slug: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post || !isJournalLocale(locale)) return {};

  const content = post.content[locale];
  const url = `${siteUrl}/${locale}/journal/${slug}`;

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: url,
      languages: journalLanguageAlternates(`/journal/${slug}`),
    },
    // Setting openGraph replaces the layout's whole object, so the site name
    // and the per-locale share image are carried over explicitly.
    openGraph: {
      title: content.title,
      description: content.description,
      url,
      siteName: business.name,
      type: 'article',
      locale,
      publishedTime: post.publishedAt,
      modifiedTime: lastModified(post),
      images: (await parent).openGraph?.images,
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isJournalLocale(locale)) notFound();

  const post = getPost(slug);
  if (!post) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'journal' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const content = post.content[locale];
  const url = `${siteUrl}/${locale}/journal/${slug}`;
  const related = getRelatedPosts(slug);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
      new Date(`${date}T00:00:00Z`)
    );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: content.title,
        description: content.description,
        datePublished: post.publishedAt,
        dateModified: lastModified(post),
        inLanguage: locale,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        url,
        author: {
          '@type': 'Person',
          name: JOURNAL_AUTHOR[locale],
          worksFor: { '@type': 'Organization', name: business.name, url: `${siteUrl}/${locale}` },
        },
        publisher: {
          '@type': 'Organization',
          name: business.name,
          url: `${siteUrl}/${locale}`,
          logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.jpg` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: tNav('home'), item: `${siteUrl}/${locale}` },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('eyebrow'),
            item: `${siteUrl}/${locale}/journal`,
          },
          { '@type': 'ListItem', position: 3, name: content.title, item: url },
        ],
      },
    ],
  };

  return (
    <section className="section-padding pt-28 md:pt-32 bg-paper-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-narrow mx-auto">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/journal"
            className="text-sm font-medium tracking-wide text-ink-400 hover:text-ink-900 transition-colors"
          >
            ← {t('backToJournal')}
          </Link>
        </nav>

        <article>
          <header>
            <p className="text-xs font-medium tracking-wider text-ink-400 uppercase">
              {t('byline', { name: JOURNAL_AUTHOR[locale] })}
              {' · '}
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              {post.updatedAt && (
                <>
                  {' · '}
                  <time dateTime={post.updatedAt}>{t('updated', { date: formatDate(post.updatedAt) })}</time>
                </>
              )}
              {' · '}
              {t('readingTime', { minutes: readingMinutes(content.body) })}
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-serif font-light leading-tight text-ink-900">
              {content.title}
            </h1>
            <p className="mt-5 text-body-large">{content.description}</p>
          </header>

          <div className="mt-10 border-t border-ink-100 pt-2">
            <Prose blocks={content.body} />
          </div>
        </article>

        <div className="mt-14 bg-white shadow-xl p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-serif font-light text-ink-900">{t('ctaTitle')}</h2>
          <p className="mt-3 text-ink-500">{t('ctaText')}</p>
          <Link href="/book" className="btn-primary mt-6 inline-flex">
            {tNav('bookNow')}
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-sm font-medium tracking-wider text-ink-500 uppercase mb-6">
              {t('keepReading')}
            </h2>
            <div className="divide-y divide-ink-100 border-t border-b border-ink-100">
              {related.map((other) => (
                <Link
                  key={other.slug}
                  href={`/journal/${other.slug}`}
                  className="group block py-5"
                >
                  <h3 className="text-lg font-serif font-normal text-ink-900 group-hover:text-brand-900 transition-colors">
                    {other.content[locale].title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-500 leading-relaxed">
                    {other.content[locale].description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
