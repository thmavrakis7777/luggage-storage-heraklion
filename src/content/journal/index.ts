import type { JournalPost } from './types';
import { JOURNAL_LOCALES } from './types';
import { siteUrl } from '@/lib/site';
import { post as safety } from './posts/is-luggage-storage-safe-in-heraklion';
import { post as speed } from './posts/drop-off-your-bags-in-under-a-minute';
import { post as prices } from './posts/luggage-storage-prices-heraklion';
import { post as location } from './posts/luggage-storage-heraklion-city-centre-location';
import { post as airportBus } from './posts/luggage-storage-near-heraklion-airport-bus';
import { post as longTerm } from './posts/long-term-luggage-storage-heraklion';
import { post as groups } from './posts/group-luggage-storage-heraklion';
import { post as heraklion } from './posts/one-day-in-heraklion-without-your-luggage';

/** Newest first — this is the order the listing page renders. */
const posts: JournalPost[] = [
  safety,
  prices,
  location,
  speed,
  airportBus,
  longTerm,
  groups,
  heraklion,
];

export function getAllPosts(): JournalPost[] {
  return posts;
}

export function getPost(slug: string): JournalPost | undefined {
  return posts.find((post) => post.slug === slug);
}

/** The other posts, for the "keep reading" links at the end of an article —
 * internal linking is most of what makes a small journal like this worth
 * publishing at all. */
export function getRelatedPosts(slug: string, count = 3): JournalPost[] {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return posts.slice(0, count);
  return [...posts.slice(index + 1), ...posts.slice(0, index)].slice(0, count);
}

/** hreflang map for a journal path. Only the languages the journal is
 * actually written in appear — pointing hreflang at locales that 404 would
 * be worse than omitting them. */
export function journalLanguageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(JOURNAL_LOCALES.map((locale) => [locale, `${siteUrl}/${locale}${path}`]));
}

export * from './types';
