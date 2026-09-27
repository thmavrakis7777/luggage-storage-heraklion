'use client';

import { useSyncExternalStore } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { getConsent, subscribeConsent } from '@/lib/consent';

/**
 * Loads gtag.js only once the visitor has accepted analytics cookies — on
 * the page where they click "Accept", or straight away on later visits.
 * strategy="afterInteractive" keeps it off the critical path. The init
 * commands (consent, js, config) are queued by the first gtag() call in
 * lib/analytics, and gtag.js drains the queue when it arrives. Renders
 * nothing at all if the env var is unset (e.g. local dev without it
 * configured), same pattern as the Telegram integration.
 */
export function GoogleAnalytics() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null);

  if (!GA_MEASUREMENT_ID || consent !== 'granted') return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
    />
  );
}
