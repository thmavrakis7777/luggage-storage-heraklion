'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { useParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
// Imported from the types module, not the journal index — the index pulls in
// every post in every language, which has no business in the client bundle.
import { isJournalLocale } from '@/content/journal/types';

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

  const navLinks = [
    { href: '#how-it-works', label: t('howItWorks') },
    { href: '#pricing', label: t('pricing') },
    { href: '#location', label: t('location') },
    { href: '#faq', label: t('faq') },
  ];

  // The journal only exists in the languages it is written in.
  const showJournal = isJournalLocale(currentLocale);

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
      <nav className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
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
              <a
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 hover:opacity-70 ${
                  solid ? 'text-ink-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </a>
            ))}
            {showJournal && (
              <Link
                href="/journal"
                className={`text-[13px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 hover:opacity-70 ${
                  solid ? 'text-ink-700' : 'text-white/90'
                }`}
              >
                {t('journal')}
              </Link>
            )}
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
                aria-label="Change language"
                aria-expanded={showLanguages}
              >
                {currentLocale}
                <ChevronDownIcon className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {showLanguages && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 flex flex-col gap-0.5 p-1.5 bg-white shadow-xl min-w-[140px] max-h-[70vh] overflow-y-auto"
                  >
                    {locales.map((locale) => (
                      <button
                        key={locale}
                        onClick={() => {
                          setShowLanguages(false);
                          router.replace(pathname, { locale });
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/book" className="hidden lg:inline-flex btn-primary text-sm px-6 py-3">
              {t('bookNow')}
            </Link>

            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setShowLanguages(false);
              }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className={`lg:hidden p-2 -mr-2 transition-colors ${solid ? 'text-ink-900' : 'text-white'}`}
            >
              {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-ink-100"
          >
            <div className="container-wide mx-auto px-4 py-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-serif font-normal tracking-wide text-ink-800 py-1"
                  >
                    {link.label}
                  </a>
                ))}
                {showJournal && (
                  <Link
                    href="/journal"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-serif font-normal tracking-wide text-ink-800 py-1"
                  >
                    {t('journal')}
                  </Link>
                )}
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
                      href={pathname}
                      locale={locale}
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
