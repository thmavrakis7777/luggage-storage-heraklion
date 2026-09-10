'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

/**
 * Kept in sync with the `notFound` key in each messages/*.json file. Not
 * read from those files directly: this component renders on a Next.js
 * not-found boundary, which Next.js only ever resolves at the true app
 * root (there's no root layout, and next-intl's server-side locale
 * detection there would force the whole site out of static generation —
 * see the dynamicParams comment in [locale]/layout.tsx). A tiny local copy
 * of just these three short strings per language keeps this 404 page
 * lightweight instead of shipping all 7 full translation files to the
 * client just to read one of them.
 */
const COPY: Record<Locale, { title: string; description: string; cta: string }> = {
  en: {
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist or may have moved. Let's get you back on track.",
    cta: 'Back to Homepage',
  },
  el: {
    title: 'Η Σελίδα Δεν Βρέθηκε',
    description: 'Η σελίδα που αναζητάτε δεν υπάρχει ή μπορεί να έχει μετακινηθεί. Ας σας επαναφέρουμε στη σωστή διαδρομή.',
    cta: 'Επιστροφή στην Αρχική',
  },
  de: {
    title: 'Seite Nicht Gefunden',
    description: 'Die gesuchte Seite existiert nicht oder wurde möglicherweise verschoben. Wir bringen Sie zurück.',
    cta: 'Zurück zur Startseite',
  },
  it: {
    title: 'Pagina Non Trovata',
    description: 'La pagina che stai cercando non esiste o potrebbe essere stata spostata. Ti riportiamo sulla strada giusta.',
    cta: 'Torna alla Home',
  },
  es: {
    title: 'Página No Encontrada',
    description: 'La página que buscas no existe o puede haberse movido. Te ayudamos a volver al camino correcto.',
    cta: 'Volver al Inicio',
  },
  nl: {
    title: 'Pagina Niet Gevonden',
    description: 'De pagina die je zoekt bestaat niet of is mogelijk verplaatst. We brengen je terug op weg.',
    cta: 'Terug naar Home',
  },
  fr: {
    title: 'Page Introuvable',
    description: "La page que vous recherchez n'existe pas ou a peut-être été déplacée. Revenons sur le bon chemin.",
    cta: 'Retour à l\'Accueil',
  },
};

// Nothing external ever changes this once the page has loaded, so there's
// nothing to actually subscribe to — the callback just satisfies the API.
function subscribe() {
  return () => {};
}

function getSnapshot(): Locale {
  const segment = window.location.pathname.split('/')[1];
  return (locales as readonly string[]).includes(segment) ? (segment as Locale) : defaultLocale;
}

// Used for the server-rendered HTML and the first client render, so
// hydration never mismatches — corrected to the real URL's locale
// immediately after, via getSnapshot.
function getServerSnapshot(): Locale {
  return defaultLocale;
}

export function NotFoundContent() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = COPY[locale];

  return (
    <section className="section-padding pt-28 md:pt-32 bg-paper-50 min-h-screen">
      <div className="container-narrow mx-auto text-center">
        <span className="eyebrow">404</span>
        <h1 className="text-headline mt-4 text-ink-900">{t.title}</h1>
        <p className="mt-3 text-ink-500 max-w-md mx-auto">{t.description}</p>
        <Link href={`/${locale}`} className="btn-primary mt-8 inline-flex">
          {t.cta}
        </Link>
      </div>
    </section>
  );
}
