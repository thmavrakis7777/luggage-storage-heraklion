import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getPost, isJournalLocale, type JournalPost } from '@/content/journal';

/** The articles linked from the homepage — the ones closest to what people
 * actually search for, so crawlers reach them one click from the root. */
const FEATURED_SLUGS = [
  'luggage-storage-heraklion-complete-guide',
  'luggage-lockers-vs-staffed-storage-heraklion',
  'luggage-storage-prices-heraklion',
  'luggage-storage-near-heraklion-port',
  'luggage-storage-near-heraklion-airport-bus',
];

export function JournalLinks() {
  const locale = useLocale();
  const t = useTranslations('journal');

  // The journal is EN/EL only; other locales have nothing to link to.
  if (!isJournalLocale(locale)) return null;

  const posts = FEATURED_SLUGS.map(getPost).filter((post): post is JournalPost => !!post);

  return (
    <section className="section-padding bg-white">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-10">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="text-headline mt-4 text-ink-900">{t('title')}</h2>
        </div>

        <ul className="divide-y divide-ink-100 border-t border-b border-ink-100">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/journal/${post.slug}`}
                className="group flex items-center justify-between gap-4 py-5"
              >
                <span className="text-lg sm:text-xl font-serif text-ink-900 group-hover:text-brand-900 transition-colors">
                  {post.content[locale].title}
                </span>
                <span aria-hidden="true" className="text-brand-900">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href="/journal"
            className="text-sm font-medium tracking-wide text-brand-900 hover:text-ink-900 transition-colors"
          >
            {t('viewAll')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
