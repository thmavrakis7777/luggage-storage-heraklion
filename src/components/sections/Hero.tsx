'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-ink-900 flex items-center">
      {/* Background: layered gradients, no external image — fast, zero network weight */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,214,0,0.12),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,214,0,0.06),_transparent_50%)]" />
        {/* Faint suitcase line-art, purely decorative */}
        <svg
          aria-hidden="true"
          className="absolute -right-24 top-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-[0.06] hidden lg:block"
          viewBox="0 0 200 200"
          fill="none"
        >
          <rect x="40" y="70" width="120" height="100" rx="10" stroke="white" strokeWidth="3" />
          <rect x="75" y="45" width="50" height="30" rx="6" stroke="white" strokeWidth="3" />
          <line x1="40" y1="110" x2="160" y2="110" stroke="white" strokeWidth="2" />
          <circle cx="65" cy="185" r="8" stroke="white" strokeWidth="3" />
          <circle cx="135" cy="185" r="8" stroke="white" strokeWidth="3" />
        </svg>
      </div>

      <div className="relative container-wide mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="eyebrow text-brand-400">{t('eyebrow')}</span>

          <h1 className="mt-5 text-5xl sm:text-6xl md:text-7xl font-serif font-light leading-[1.05] tracking-tight text-white text-balance">
            {t('title')}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/70 font-light max-w-xl">
            {t('subtitle')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/book" className="btn-primary">
              {t('ctaPrimary')}
            </Link>
            <a href="#location" className="btn-secondary !border-white/40 !text-white hover:!bg-white hover:!text-ink-900">
              {t('ctaSecondary')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
