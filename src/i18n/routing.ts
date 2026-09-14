import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  // hreflang is emitted per page in <head> by generateMetadata, including the
  // journal's EN/EL-only set. The middleware's automatic `Link` response
  // header contradicted that on every page: it listed all 7 locales (e.g.
  // /de/journal, which 404s) plus an unprefixed x-default that doesn't exist.
  alternateLinks: false,
});
