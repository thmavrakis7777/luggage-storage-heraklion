'use client';

import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

/**
 * Loads gtag.js with strategy="afterInteractive" — after the page has
 * hydrated, never blocking initial render or LCP. send_page_view is
 * disabled here since AnalyticsPageView sends every page_view (including
 * the first) explicitly, giving one consistent code path instead of two.
 * Renders nothing at all if the env var is unset (e.g. local dev without
 * it configured), same pattern as the Telegram integration.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
window.dataLayer.push(['js', new Date()]);
window.dataLayer.push(['config', '${GA_MEASUREMENT_ID}', { send_page_view: false }]);`}
      </Script>
    </>
  );
}
