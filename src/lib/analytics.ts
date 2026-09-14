/**
 * GA4 client-side helpers. Commands go through the same queueing `gtag()`
 * function as Google's own snippet, which only needs `window.dataLayer` —
 * so this works correctly even before the actual gtag.js library has
 * finished loading (it drains the queued array once it does). Every export
 * is a no-op if the measurement ID isn't configured or `window` isn't
 * available, and none of them ever throw — analytics must never break or
 * delay the booking flow.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  try {
    // gtag.js only processes commands pushed as an `arguments` object — a
    // plain array is silently ignored, so nothing would ever be sent.
    window.gtag ??= function () {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer ??= []).push(arguments);
    };
    window.gtag(...args);
  } catch {
    // Never let a blocked/broken analytics call affect the app.
  }
}

/** Manual page_view — the init script sets send_page_view: false so this is
 * the single source of page views, covering both the first load and every
 * client-side route change. */
export function sendPageView(path: string) {
  gtag('event', 'page_view', { page_path: path });
}

/** Fires once the booking form has passed client-side validation and the
 * customer is genuinely attempting to submit — not on page view (already
 * covered separately) and not on every keystroke. */
export function trackBookingStarted() {
  gtag('event', 'booking_started');
}

/** Fires only after the booking has actually been created server-side.
 * Deliberately carries no PII — just the opaque booking reference and the
 * amount, nothing identifying the customer. */
export function trackBookingCompleted({
  reference,
  valueEuros,
}: {
  reference: string;
  valueEuros: number;
}) {
  gtag('event', 'booking_completed', {
    transaction_id: reference,
    value: valueEuros,
    currency: 'EUR',
  });
}
