import { useTranslations } from 'next-intl';
import {
  CurrencyEuroIcon,
  TagIcon,
  CreditCardIcon,
  ArchiveBoxIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

export function QuickBenefits() {
  const t = useTranslations('benefits');

  const items = [
    { Icon: CurrencyEuroIcon, label: t('price') },
    { Icon: TagIcon, label: t('discount'), highlight: true },
    { Icon: CreditCardIcon, label: t('payment') },
    { Icon: ArchiveBoxIcon, label: t('anySize') },
    { Icon: ShieldCheckIcon, label: t('secure') },
    { Icon: CalendarDaysIcon, label: t('longStay'), highlight: true },
  ];

  return (
    <section className="relative z-10 -mt-10 sm:-mt-12">
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-ink-100">
          {items.map(({ Icon, label, highlight }) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center gap-2 text-center px-3 py-5 sm:py-7 ${
                highlight ? 'bg-brand-50' : ''
              }`}
            >
              <Icon className={`w-6 h-6 ${highlight ? 'text-brand-800' : 'text-ink-400'}`} />
              <span className="text-[13px] sm:text-sm font-medium text-ink-800 leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
