import type { Metadata } from 'next';
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
  readingMinutes,
  JOURNAL_LOCALES,
  type Block,
} from '@/content/journal';

/** Both params are generated here so the journal's 2 languages don't get
 * crossed with the site's other 5 — with dynamicParams off, that also makes
 * /de/journal/<slug> a 404 rather than a thin English-fallback page. */
export function generateStaticParams() {
  return JOURNAL_LOCALES.flatMap((locale) =>
    getAllPosts().map((post) => ({ locale, slug: post.slug }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
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
    openGraph: {
      title: content.title,
      description: content.description,
      url,
      type: 'article',
      locale,
      publishedTime: post.publishedAt,
    },
  };
}

function renderBlock(block: Block, index: number) {
  if (block.type === 'h2') {
    return (
      <h2 key={index} className="mt-10 mb-3 text-2xl font-serif font-medium text-ink-900">
        {block.text}
      </h2>
    );
  }

  if (block.type === 'ul') {
    return (
      <ul key={index} className="mt-4 space-y-2">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3 text-ink-600 leading-relaxed">
            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={index} className="mt-4 text-ink-600 leading-relaxed">
      {block.text}
    </p>
  );
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

  const publishedLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${post.publishedAt}T00:00:00Z`));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: content.title,
        description: content.description,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        inLanguage: locale,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        url,
        author: { '@type': 'Organization', name: business.name, url: `${siteUrl}/${locale}` },
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
              <time dateTime={post.publishedAt}>{publishedLabel}</time>
              {' · '}
              {t('readingTime', { minutes: readingMinutes(content.body) })}
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-serif font-light leading-tight text-ink-900">
              {content.title}
            </h1>
            <p className="mt-5 text-body-large">{content.description}</p>
          </header>

          <div className="mt-10 border-t border-ink-100 pt-2">
            {content.body.map(renderBlock)}
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
