'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sendPageView } from '@/lib/analytics';

/**
 * Fires page_view on mount and on every client-side route change, using the
 * real (locale-prefixed) pathname — plain next/navigation, not the i18n
 * navigation wrapper, which strips the locale for routing convenience.
 * Deliberately doesn't read search params: that would opt this component
 * out of static rendering, and this site has no query-param-driven pages.
 */
export function AnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    sendPageView(pathname);
  }, [pathname]);

  return null;
}
