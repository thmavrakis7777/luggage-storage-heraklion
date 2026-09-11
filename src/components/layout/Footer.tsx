'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/ui/Logo';
import { locales, localeNames } from '@/i18n/config';
import { business, googleMapsUrl, telHref, whatsappHref } from '@/lib/site';
// Types module, not the journal index — the index would drag every post into
// the client bundle.
import { isJournalLocale } from '@/content/journal/types';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const showJournal = isJournalLocale(useLocale());

  return (
    <footer className="bg-ink-900 text-white">
      <div className="container-wide mx-auto section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Logo size={40} />
              <span className="font-serif text-lg text-white">{business.name}</span>
            </Link>
            <p className="mt-4 text-white/60 max-w-sm">{t('tagline')}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wide uppercase text-white/50 mb-4">
              {t('quickLinksTitle')}
            </h3>
            <ul className="space-y-3 text-white/70">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{nav('howItWorks')}</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">{nav('pricing')}</a></li>
              <li><a href="#location" className="hover:text-white transition-colors">{nav('location')}</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">{nav('faq')}</a></li>
              {showJournal && (
                <li><Link href="/journal" className="hover:text-white transition-colors">{nav('journal')}</Link></li>
              )}
              <li><Link href="/book" className="hover:text-white transition-colors">{nav('bookNow')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wide uppercase text-white/50 mb-4">
              {t('contactTitle')}
            </h3>
            <ul className="space-y-3 text-white/70">
              <li>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {business.streetAddress}, {business.postalCode} {business.addressLocality}
                </a>
              </li>
              <li>
                <a href={telHref} className="hover:text-white transition-colors">{business.phoneDisplay}</a>
              </li>
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} {business.name}. {t('rights')}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {locales.map((locale) => (
              <Link
                key={locale}
                href="/"
                locale={locale}
                className="text-xs text-white/40 hover:text-white/80 transition-colors"
              >
                {localeNames[locale]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
