import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { siteUrl } from '@/lib/site';
import {
  getAllPosts,
  isJournalLocale,
  journalLanguageAlternates,
  JOURNAL_LOCALES,
  lastModified,
} from '@/content/journal';

// lastmod must only move when a page's content actually changes — Google
// ignores lastmod on sites where it changes on every deploy. Bump these by
// hand when the copy of these pages is edited.
const HOME_UPDATED = '2026-09-24';
// The EN/EL homepages also carry the journal links section, added later.
const HOME_WITH_JOURNAL_UPDATED = '2026-09-24';
const BOOK_UPDATED = '2026-09-14';

const pages = ['', '/book'];

function pageUpdated(page: string, locale: string): string {
  if (page === '/book') return BOOK_UPDATED;
  return isJournalLocale(locale) ? HOME_WITH_JOURNAL_UPDATED : HOME_UPDATED;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: new Date(`${pageUpdated(page, locale)}T00:00:00Z`),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
        // Mirrors the hreflang set each page emits in <head>, x-default included.
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${page}`])),
            'x-default': `${siteUrl}/${locales[0]}${page}`,
          },
        },
      });
    }
  }

  // The journal is written in EN/EL only, so its alternates list just those
  // two — advertising hreflang for locales that 404 would be worse than
  // omitting them.
  const posts = getAllPosts();
  const newestPost = posts.map(lastModified).reduce((latest, date) => (date > latest ? date : latest));

  for (const locale of JOURNAL_LOCALES) {
    entries.push({
      url: `${siteUrl}/${locale}/journal`,
      lastModified: new Date(`${newestPost}T00:00:00Z`),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: journalLanguageAlternates('/journal') },
    });
  }

  for (const post of posts) {
    for (const locale of JOURNAL_LOCALES) {
      entries.push({
        url: `${siteUrl}/${locale}/journal/${post.slug}`,
        lastModified: new Date(`${lastModified(post)}T00:00:00Z`),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages: journalLanguageAlternates(`/journal/${post.slug}`) },
      });
    }
  }

  return entries;
}
