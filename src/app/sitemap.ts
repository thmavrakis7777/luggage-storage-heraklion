import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { siteUrl } from '@/lib/site';
import { getAllPosts, JOURNAL_LOCALES } from '@/content/journal';

const pages = ['', '/book'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${page}`])),
        },
      });
    }
  }

  // The journal is written in EN/EL only, so its alternates list just those
  // two — advertising hreflang for locales that 404 would be worse than
  // omitting them.
  const posts = getAllPosts();
  const journalAlternates = (path: string) =>
    Object.fromEntries(JOURNAL_LOCALES.map((l) => [l, `${siteUrl}/${l}${path}`]));
  const newestPost = posts.reduce(
    (latest, post) => (post.publishedAt > latest ? post.publishedAt : latest),
    posts[0].publishedAt
  );

  for (const locale of JOURNAL_LOCALES) {
    entries.push({
      url: `${siteUrl}/${locale}/journal`,
      lastModified: new Date(`${newestPost}T00:00:00Z`),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: journalAlternates('/journal') },
    });
  }

  for (const post of posts) {
    for (const locale of JOURNAL_LOCALES) {
      entries.push({
        url: `${siteUrl}/${locale}/journal/${post.slug}`,
        lastModified: new Date(`${post.publishedAt}T00:00:00Z`),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages: journalAlternates(`/journal/${post.slug}`) },
      });
    }
  }

  return entries;
}
