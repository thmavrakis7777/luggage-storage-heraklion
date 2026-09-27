import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { isJournalLocale } from '@/content/journal/types';
import { CookieBanner } from './CookieBanner';

/** Server side of the cookie banner: resolves its text here so the client
 * bundle doesn't need the message file. No analytics configured means no
 * non-essential cookies, so there is nothing to ask. */
export function CookieConsent() {
  const t = useTranslations('cookies');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <CookieBanner
      label={t('label')}
      text={t('text')}
      accept={t('accept')}
      reject={t('reject')}
      privacy={tFooter('privacy')}
      // The policy is written in EN/EL; the other languages get English.
      privacyLocale={isJournalLocale(locale) ? (locale as Locale) : 'en'}
    />
  );
}
