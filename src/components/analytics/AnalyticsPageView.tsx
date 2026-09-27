'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { sendPageView } from '@/lib/analytics';
import { getConsent, subscribeConsent } from '@/lib/consent';

/**
 * Fires page_view on mount and on every client-side route change, using the
 * real (locale-prefixed) pathname — plain next/navigation, not the i18n
 * navigation wrapper, which strips the locale for routing convenience.
 * Also fires when the visitor accepts cookies, so the page they accepted on
 * is counted. Deliberately doesn't read search params: that would opt this
 * component out of static rendering, and this site has no
 * query-param-driven pages.
 */
export function AnalyticsPageView() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null);

  useEffect(() => {
    if (consent === 'granted') sendPageView(pathname);
  }, [pathname, consent]);

  return null;
}
