/**
 * The journal is authored, not machine-translated, so a language only
 * appears here once real copy exists for it. The rest of the site stays
 * 7-language; the journal is deliberately EN + EL only rather than
 * publishing thin auto-translated duplicates of the same article.
 */
export const JOURNAL_LOCALES = ['en', 'el'] as const;
export type JournalLocale = (typeof JOURNAL_LOCALES)[number];

export function isJournalLocale(locale: string): locale is JournalLocale {
  return (JOURNAL_LOCALES as readonly string[]).includes(locale);
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export interface PostContent {
  title: string;
  /** Doubles as the meta description and the listing-card excerpt. */
  description: string;
  body: Block[];
}

export interface JournalPost {
  slug: string;
  /** ISO date — drives datePublished in JSON-LD and lastmod in the sitemap. */
  publishedAt: string;
  content: Record<JournalLocale, PostContent>;
}

/** Rough reading time from the post body, so it never drifts out of sync
 * with the copy the way a hand-written number would. */
export function readingMinutes(body: Block[]): number {
  const words = body.reduce((total, block) => {
    const text = block.type === 'ul' ? block.items.join(' ') : block.text;
    return total + text.split(/\s+/).length;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}
