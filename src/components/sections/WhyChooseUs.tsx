import { useTranslations } from 'next-intl';
import {
  ShieldCheckIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  ArchiveBoxIcon,
  SparklesIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const icons = {
  secure: ShieldCheckIcon,
  flexible: ClockIcon,
  family: HeartIcon,
  central: MapPinIcon,
  anySize: ArchiveBoxIcon,
  toilet: SparklesIcon,
  transfer: TruckIcon,
} as const;

export function WhyChooseUs() {
  const t = useTranslations('why');
  const keys = Object.keys(icons) as (keyof typeof icons)[];

  return (
    <section className="section-padding bg-paper-100">
      <div className="container-wide mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="text-headline mt-4 text-ink-900">{t('title')}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {keys.map((key) => {
            const Icon = icons[key];
            return (
              <div key={key} className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-white border border-ink-100">
                  <Icon className="w-5 h-5 text-brand-800" />
                </div>
                <div>
                  <h3 className="font-medium text-ink-900">{t(`items.${key}.title`)}</h3>
                  <p className="mt-1 text-sm text-ink-500 leading-relaxed">
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
