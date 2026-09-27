'use client';

import { openCookieSettings } from '@/lib/consent';

/** Footer link that re-opens the cookie banner, so visitors can change or
 * withdraw their choice at any time. */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {label}
    </button>
  );
}
