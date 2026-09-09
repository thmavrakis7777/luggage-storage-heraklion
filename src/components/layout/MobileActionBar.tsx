'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { telHref, whatsappHref, googleMapsUrl } from '@/lib/site';

export function MobileActionBar() {
  const t = useTranslations('mobileBar');

  const items = [
    { href: '/book', label: t('book'), Icon: CalendarDaysIcon, primary: true, external: false },
    { href: whatsappHref, label: t('whatsapp'), Icon: ChatBubbleLeftRightIcon, primary: false, external: true },
    { href: telHref, label: t('call'), Icon: PhoneIcon, primary: false, external: true },
    { href: googleMapsUrl, label: t('map'), Icon: MapPinIcon, primary: false, external: true },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 grid grid-cols-4 border-t border-ink-100 bg-white md:hidden [padding-bottom:env(safe-area-inset-bottom)]"
      aria-label="Quick actions"
    >
      {items.map(({ href, label, Icon, primary, external }) =>
        external ? (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium tracking-wide ${
              primary ? 'bg-brand-500 text-ink-900' : 'text-ink-700 active:bg-ink-50'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </a>
        ) : (
          <Link
            key={label}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium tracking-wide ${
              primary ? 'bg-brand-500 text-ink-900' : 'text-ink-700 active:bg-ink-50'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        )
      )}
    </nav>
  );
}
