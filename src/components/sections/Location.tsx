'use client';

import { useTranslations } from 'next-intl';
import { MapPinIcon, PhoneIcon, ChatBubbleLeftRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import { business, googleMapsUrl, telHref, whatsappHref } from '@/lib/site';
import { OPENING_HOURS_DISPLAY } from '@/lib/hours';

export function Location() {
  const t = useTranslations('location');
  const tHours = useTranslations('hours');
  const distanceKeys = ['cathedral', 'lions', 'port', 'busStation', 'airport'] as const;

  return (
    <section id="location" className="section-padding bg-white">
      <div className="container-wide mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="eyebrow">{t('eyebrow')}</span>
            <h2 className="text-headline mt-4 text-ink-900">{t('title')}</h2>

            <div className="mt-8">
              <p className="text-sm font-medium tracking-wide uppercase text-ink-400">
                {t('addressLabel')}
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-start gap-2 text-xl font-serif text-ink-900 hover:text-brand-900 transition-colors"
              >
                <MapPinIcon className="w-6 h-6 flex-shrink-0 text-brand-800 mt-0.5" />
                {business.streetAddress}, {business.postalCode} {business.addressLocality}, {business.addressRegion}, Greece
              </a>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium tracking-wide uppercase text-ink-400 mb-2">
                {t('hoursLabel')}
              </p>
              <ul className="space-y-1.5">
                {OPENING_HOURS_DISPLAY.map(({ labelKey, open, close }) => (
                  <li key={labelKey} className="flex items-center gap-3 text-ink-700">
                    <ClockIcon className="w-4 h-4 flex-shrink-0 text-brand-800" />
                    <span className="w-32 flex-shrink-0">{tHours(labelKey)}</span>
                    <span>
                      {open}–{close}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-ink-400 max-w-md">{tHours('advanceBookingNote')}</p>
            </div>

            <ul className="mt-8 space-y-3">
              {distanceKeys.map((key) => (
                <li key={key} className="flex items-center gap-3 text-ink-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                  {t(`distances.${key}`)}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                {t('openMaps')}
              </a>
              <a href={telHref} className="btn-secondary inline-flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" />
                {t('call')}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                {t('whatsapp')}
              </a>
            </div>
          </div>

          <div className="aspect-[4/3] w-full overflow-hidden border border-ink-100">
            <iframe
              title="Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                `${business.streetAddress}, ${business.postalCode} ${business.addressLocality}, Greece`
              )}&z=16&output=embed`}
              className="w-full h-full grayscale-[20%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
