'use client';

import { useSyncExternalStore } from 'react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/config';
import {
  getConsent,
  isCookieSettingsOpen,
  setConsent,
  subscribeConsent,
} from '@/lib/consent';

interface CookieBannerProps {
  label: string;
  text: string;
  accept: string;
  reject: string;
  privacy: string;
  privacyLocale: Locale;
}

/**
 * Asks before Google Analytics sets any cookie. Shown until the visitor
 * answers, and again from the footer's "Cookie settings". Accept and Reject
 * are the same size and style on purpose — the Greek DPA requires refusing
 * to be as easy as accepting — and the site stays usable while it's open.
 * Hidden during server rendering (the choice lives in the browser), so it
 * appears right after hydration.
 */
export function CookieBanner({ label, text, accept, reject, privacy, privacyLocale }: CookieBannerProps) {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => undefined);
  const settingsOpen = useSyncExternalStore(subscribeConsent, isCookieSettingsOpen, () => false);

  if (consent === undefined || (consent !== null && !settingsOpen)) return null;

  const buttonClass = 'btn-secondary px-4 py-2 text-[13px]';

  return (
    <section
      aria-label={label}
      className="fixed inset-x-0 z-50 px-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-6"
    >
      <div className="mx-auto max-w-2xl bg-white border border-ink-100 shadow-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="flex-1 text-[13px] text-ink-700 leading-snug">
          {text}{' '}
          <Link
            href="/privacy"
            locale={privacyLocale}
            className="underline underline-offset-2 hover:text-ink-900 transition-colors"
          >
            {privacy}
          </Link>
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          <button type="button" onClick={() => setConsent('denied')} className={buttonClass}>
            {reject}
          </button>
          <button type="button" onClick={() => setConsent('granted')} className={buttonClass}>
            {accept}
          </button>
        </div>
      </div>
    </section>
  );
}
