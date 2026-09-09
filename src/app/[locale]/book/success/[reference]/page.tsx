import { setRequestLocale, getTranslations } from 'next-intl/server';
import { CheckCircleIcon, MapPinIcon, PhoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@/i18n/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { business, googleMapsUrl, telHref, whatsappHref } from '@/lib/site';
import type { LuggageSize } from '@/lib/pricing';

const sizeLabelKey = { backpack: 'backpack', cabin: 'cabin', large: 'large' } as const;

interface BookingItem {
  luggage_size: LuggageSize;
  quantity: number;
}

/** Postgres `time` comes back as HH:MM:SS — trim to HH:MM for display. */
function formatTime(time: string): string {
  return time.slice(0, 5);
}

export default async function BookingSuccessPage({
  params,
}: {
  params: Promise<{ locale: string; reference: string }>;
}) {
  const { locale, reference } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'success' });
  const tForm = await getTranslations({ locale, namespace: 'booking.form' });

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc('get_booking_by_reference', {
    p_reference: reference,
  });

  const booking = data?.[0];

  if (error || !booking) {
    return (
      <section className="section-padding pt-28 md:pt-32 bg-paper-50 min-h-screen">
        <div className="container-narrow mx-auto text-center">
          <p className="text-ink-600">{t('notFound')}</p>
          <Link href="/" className="btn-secondary mt-6 inline-flex">
            {t('backHome')}
          </Link>
        </div>
      </section>
    );
  }

  const items: BookingItem[] = booking.items ?? [];
  const itemsLabel = items
    .map((item) => `${item.quantity} × ${tForm(sizeLabelKey[item.luggage_size])}`)
    .join(', ');
  const dateLabel =
    booking.dropoff_date === booking.pickup_date
      ? booking.dropoff_date
      : `${booking.dropoff_date} → ${booking.pickup_date}`;

  return (
    <section className="section-padding pt-28 md:pt-32 bg-paper-50 min-h-screen">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-10">
          <CheckCircleIcon className="w-14 h-14 text-brand-800 mx-auto" />
          <h1 className="text-headline mt-4 text-ink-900 max-w-xl mx-auto">{t('title')}</h1>
          <p className="mt-3 text-sm tracking-widest uppercase text-ink-400">
            {t('reference')}: <span className="font-semibold text-ink-900">{booking.booking_reference}</span>
          </p>
        </div>

        <div className="bg-white shadow-xl p-6 sm:p-10 space-y-8">
          <div>
            <h2 className="text-sm font-medium tracking-wider text-ink-500 uppercase mb-4">
              {t('details')}
            </h2>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-ink-400">{t('dates')}</dt>
              <dd className="text-ink-900 font-medium">{dateLabel}</dd>
              <dt className="text-ink-400">{t('duration')}</dt>
              <dd className="text-ink-900 font-medium">
                {tForm('duration', { days: booking.storage_days })}
              </dd>
              <dt className="text-ink-400">{t('dropoffTime')}</dt>
              <dd className="text-ink-900 font-medium">{formatTime(booking.dropoff_time)}</dd>
              <dt className="text-ink-400">{t('pickupTime')}</dt>
              <dd className="text-ink-900 font-medium">{formatTime(booking.pickup_time)}</dd>
              <dt className="text-ink-400">{t('luggage')}</dt>
              <dd className="text-ink-900 font-medium">{itemsLabel}</dd>
              <dt className="text-ink-400">{t('bags')}</dt>
              <dd className="text-ink-900 font-medium">{booking.total_bags}</dd>
            </dl>
          </div>

          <div className="bg-paper-100 p-6 space-y-2">
            <div className="flex justify-between text-ink-600">
              <span>{t('original')}</span>
              <span>€{Number(booking.original_price).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-900 font-medium">
              <span>{t('discount', { percent: booking.discount_percentage })}</span>
              <span>-€{Number(booking.discount_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink-900 font-semibold text-lg pt-2 border-t border-ink-200">
              <span>{t('final')}</span>
              <span>€{Number(booking.final_price).toFixed(2)}</span>
            </div>
            <p className="text-xs text-ink-400 pt-1">{t('paymentNote')}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium tracking-wider text-ink-500 uppercase mb-4">
              {t('addressTitle')}
            </h2>
            <p className="text-ink-700 mb-4">
              {business.streetAddress}, {business.postalCode} {business.addressLocality}, {business.addressRegion}, Greece
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                <MapPinIcon className="w-4 h-4" />
                {t('openMaps')}
              </a>
              <a href={telHref} className="btn-secondary inline-flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" />
                {t('call')}
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                {t('whatsapp')}
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="btn-ghost">
            {t('backHome')}
          </Link>
        </div>
      </div>
    </section>
  );
}
