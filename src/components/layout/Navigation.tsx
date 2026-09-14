'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { isJournalLocale } from '@/content/journal/types';
import { useParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

export function Navigation() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as Locale;

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    let lastValue: boolean | null = null;

    const checkScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 40;
        if (next !== lastValue) {
          lastValue = next;
          setIsScrolled(next);
        }
        ticking = false;
      });
    };

    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // Close the mobile menu / language popover on any click or tap outside the header.
  useEffect(() => {
    if (!isOpen && !showLanguages) return;

    const handleOutsideClick = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowLanguages(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [isOpen, showLanguages]);

  // The section anchors only exist on the homepage, so they always point
  // there — a bare #pricing did nothing on /book, /journal or an article.
  const navLinks = [
    { hash: 'how-it-works', label: t('howItWorks') },
    { hash: 'pricing', label: t('pricing') },
    { hash: 'location', label: t('location') },
    { hash: 'faq', label: t('faq') },
  ];

  // The journal is EN/EL only, so switching a journal page to any other
  // language lands on that language's homepage instead of a 404.
  const isJournalPage = pathname === '/journal' || pathname.startsWith('/journal/');
  const pathForLocale = (locale: Locale) =>
    isJournalPage && !isJournalLocale(locale) ? '/' : pathname;

  // The transparent header with white text only works over the homepage's
  // dark hero. Every other page (/book, /journal, booking confirmation) has a
  // near-white background, where white-on-white made the logo and links
  // invisible — so those render the solid treatment from the start.
  const solid = isScrolled || pathname !== '/';

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-white/95 shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav aria-label={t('mainNavigation')} className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 min-w-0 transition-opacity hover:opacity-80"
          >
            <Logo
              size={64}
              priority
              className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex-shrink-0"
            />
            <span
              className={`flex flex-col leading-tight ${solid ? 'text-ink-900' : 'text-white'}`}
            >
              <span className="font-serif text-base sm:text-lg lg:text-xl font-medium tracking-tight">
                Luggage Storage
              </span>
              <span
                className={`mt-0.5 text-[9px] sm:text-[10px] font-sans font-medium tracking-[0.3em] uppercase ${
                  solid ? 'text-brand-900' : 'text-brand-400'
                }`}
              >
                Heraklion
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.hash}
                href={{ pathname: '/', hash: link.hash }}
                className={`text-[13px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 hover:opacity-70 ${
                  solid ? 'text-ink-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            {/* Language switcher — visible at every breakpoint, not just desktop */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLanguages(!showLanguages);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-1 text-[13px] font-medium uppercase tracking-wide transition-colors ${
                  solid ? 'text-ink-700' : 'text-white/90'
                }`}
                aria-label={t('changeLanguage')}
                aria-expanded={showLanguages}
              >
                {currentLocale}
                <ChevronDownIcon className="w-3.5 h-3.5" />
              </button>
              {/* Always mounted so it can fade/slide out as well as in (150ms,
                  8px); `invisible` keeps it out of the tab order and the
                  accessibility tree while closed. */}
              <div
                className={`absolute right-0 mt-3 flex flex-col gap-0.5 p-1.5 bg-white shadow-xl min-w-[140px] max-h-[70vh] overflow-y-auto transition-[opacity,translate,visibility] duration-150 ease-[cubic-bezier(0.42,0,0.58,1)] ${
                  showLanguages ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-2'
                }`}
              >
                {locales.map((locale) => (
                  <button
                    key={locale}
                    lang={locale}
                    onClick={() => {
                      setShowLanguages(false);
                      router.replace(pathForLocale(locale), { locale });
                    }}
                    className={`text-left text-sm px-3 py-2 transition-colors ${
                      locale === currentLocale
                        ? 'bg-brand-50 text-ink-900 font-medium'
                        : 'text-ink-600 hover:bg-ink-50'
                    }`}
                  >
                    {localeNames[locale]}
                  </button>
                ))}
              </div>
            </div>

            <Link href="/book" className="hidden lg:inline-flex btn-primary text-sm px-6 py-3">
              {t('bookNow')}
            </Link>

            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setShowLanguages(false);
              }}
              aria-label={isOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={isOpen}
              className={`lg:hidden p-2 -mr-2 transition-colors ${solid ? 'text-ink-900' : 'text-white'}`}
            >
              {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu: animating grid rows 0fr → 1fr opens it to its natural
          height (with the fade) in plain CSS, closing the same way. */}
      <div
        className={`lg:hidden grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-[cubic-bezier(0.25,0.1,0.35,1)] ${
          isOpen ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden bg-white border-t border-ink-100">
          <div className="container-wide mx-auto px-4 py-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.hash}
                  href={{ pathname: '/', hash: link.hash }}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-serif font-normal tracking-wide text-ink-800 py-1"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="btn-primary mt-2"
              >
                {t('bookNow')}
              </Link>
              <hr className="my-2 border-ink-100" />
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {locales.map((locale) => (
                  <Link
                    key={locale}
                    href={pathForLocale(locale)}
                    locale={locale}
                    lang={locale}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium ${
                      currentLocale === locale ? 'text-ink-900' : 'text-ink-400'
                    }`}
                  >
                    {localeNames[locale]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
