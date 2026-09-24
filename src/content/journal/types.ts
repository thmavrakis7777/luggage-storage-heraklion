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
  /** ISO date — datePublished in JSON-LD. */
  publishedAt: string;
  /** ISO date of the last real change to the copy. Shown as "Updated …" and
   * used for dateModified and the sitemap. Set it when you edit a post. */
  updatedAt?: string;
  content: Record<JournalLocale, PostContent>;
}

export function lastModified(post: JournalPost): string {
  return post.updatedAt ?? post.publishedAt;
}

/** Links inside block text are written `[link text](/book)`. Paths starting
 * with / are site pages without the locale (it is added when rendered);
 * anything else must be a full https:// URL. */
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export type InlinePart = string | { text: string; href: string };

export function splitLinks(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push({ text: match[1], href: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function plainText(text: string): string {
  return text.replace(LINK, '$1');
}

export function blockTexts(block: Block): string[] {
  return block.type === 'ul' ? block.items : [block.text];
}

/** Rough reading time from the post body, so it never drifts out of sync
 * with the copy the way a hand-written number would. */
export function readingMinutes(body: Block[]): number {
  const words = body
    .flatMap(blockTexts)
    .reduce((total, text) => total + plainText(text).split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 200));
}
