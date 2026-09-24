import type { Metadata } from 'next';
import { Cormorant_Garamond, EB_Garamond, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { siteUrl, business, geo } from '@/lib/site';
import { OPENING_HOURS_SCHEMA } from '@/lib/hours';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { MobileActionBar } from '@/components/layout/MobileActionBar';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { AnalyticsPageView } from '@/components/analytics/AnalyticsPageView';
import '../globals.css';

// `subsets` only decides what is preloaded — every subset stays available
// through unicode-range and downloads if a page actually uses it. Preloading
// latin-ext too cost ~117 KB of high-priority font downloads on every page
// for characters the copy barely uses.
const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  preload: true,
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  preload: true,
});

// Cormorant has no Greek glyphs. EB Garamond supplies them on Greek pages only
// (see html:lang(el) in globals.css). Variable font, so one file per subset
// covers every weight; not preloaded, so other languages never download it.
const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['greek'],
  display: 'swap',
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// [locale] structurally matches any single path segment. Without this, an
// arbitrary URL like /whatever would render the (English-fallback) homepage
// at 200 instead of 404ing — a duplicate-content/crawlability risk. This
// restricts valid values to the 7 real locales from generateStaticParams.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
        'x-default': `${siteUrl}/${locales[0]}`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${siteUrl}/${locale}`,
      siteName: business.name,
      locale,
      type: 'website',
    },
    // Card type only: X falls back to each page's own og:title and
    // og:description. A title/description here was inherited verbatim by
    // every page that doesn't set `twitter` itself — i.e. all of them.
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale: locale as Locale, namespace: 'meta' });
  const tNav = await getTranslations({ locale: locale as Locale, namespace: 'nav' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SelfStorage',
    name: business.name,
    description: t('description'),
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}/logo.jpg`,
    telephone: business.phone,
    priceRange: '€3–€5',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.streetAddress,
      postalCode: business.postalCode,
      addressLocality: business.addressLocality,
      addressRegion: business.addressRegion,
      addressCountry: business.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    areaServed: {
      '@type': 'City',
      name: 'Heraklion',
    },
    openingHoursSpecification: OPENING_HOURS_SCHEMA.map(({ days, open, close }) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days.map((day) => `https://schema.org/${day}`),
      opens: open,
      closes: close,
    })),
  };

  return (
    <html
      lang={locale}
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable} ${ebGaramond.variable} scroll-smooth`}
    >
      <head>
        <meta name="theme-color" content="#ffd600" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-paper-50 text-ink-800 pb-16 md:pb-0">
        <GoogleAnalytics />
        <AnalyticsPageView />
        {/* Navigation is the only client component here that reads
            translations (BookingForm gets its own namespace on /book), so
            the rest of the message file never has to ship to the browser. */}
        <NextIntlClientProvider messages={{ nav: messages.nav }}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[10000] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-white focus:text-ink-900 focus:shadow-lg"
          >
            {tNav('skipToContent')}
          </a>
          <Navigation />
          <main id="main-content" className="relative">
            {children}
            <NoiseOverlay opacity={0.03} />
          </main>
          <Footer />
          <MobileActionBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
