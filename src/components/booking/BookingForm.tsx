'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  calculatePrice,
  computeStorageDays,
  formatCents,
  LUGGAGE_SIZES,
  type LuggageQuantities,
} from '@/lib/pricing';
import {
  currentSlotInHeraklion,
  isAdvanceBookingRequired,
  timeOptionsFor,
  todayInHeraklion,
} from '@/lib/hours';
import { normalizePhone, PHONE_PATTERN } from '@/lib/phone';
import { trackBookingStarted, trackBookingCompleted } from '@/lib/analytics';
import type { Locale } from '@/i18n/config';
import { isJournalLocale } from '@/content/journal/types';

const inputClass =
  'w-full h-14.5 pl-12 pr-4 py-4 bg-paper-50 border border-ink-200 focus:border-ink-500 focus:outline-none transition-colors text-ink-900 placeholder:text-ink-400';

const EMPTY_ITEMS: LuggageQuantities = { backpack: 0, cabin: 0, large: 0 };

// "Today" has to come from the visitor's browser, not the build: this page is
// pre-rendered, and a date baked in at build time left past days selectable
// until the next deploy. The server render uses '' (no limit) so hydration
// matches, then React re-renders with the real date straight away.
const subscribeToNothing = () => () => {};
const noDateOnServer = () => '';

/** /api/book validation codes → the customer-facing error to show. The
 * code is more specific than the field, so it wins when both are known. */
const ISSUE_MESSAGE_KEYS: Record<string, string> = {
  date_in_past: 'dateInPast',
  time_in_past: 'timePassed',
  pickup_before_dropoff_date: 'pickupBeforeDropoffDate',
  pickup_before_dropoff_time: 'pickupBeforeDropoffTime',
  no_items: 'noItems',
  too_many_items: 'tooManyBags',
};
const ISSUE_FIELD_KEYS: Record<string, string> = {
  customerName: 'name',
  customerPhone: 'phone',
  dropoffDate: 'dropoffDate',
  pickupDate: 'pickupDate',
  dropoffTime: 'dropoffTime',
  pickupTime: 'pickupTime',
  items: 'tooManyBags',
};

interface ServerIssue {
  path?: unknown[];
  message?: string;
}

function errorKeyFor(issues: ServerIssue[] | undefined): string {
  const issue = issues?.[0];
  const field = issue?.path?.[0];
  return (
    (issue?.message && ISSUE_MESSAGE_KEYS[issue.message]) ||
    (typeof field === 'string' && ISSUE_FIELD_KEYS[field]) ||
    'generic'
  );
}

export function BookingForm() {
  const t = useTranslations('booking');
  const tErr = useTranslations('booking.errors');
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [items, setItems] = useState<LuggageQuantities>(EMPTY_ITEMS);
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = useSyncExternalStore(subscribeToNothing, todayInHeraklion, noDateOnServer);

  const storageDays = useMemo(
    () => (dropoffDate && pickupDate ? computeStorageDays(dropoffDate, pickupDate) : 1),
    [dropoffDate, pickupDate]
  );
  const price = useMemo(() => calculatePrice(items, storageDays), [items, storageDays]);

  // For a same-day drop-off, only slots from the current half hour onwards.
  const dropoffTimeOptions = useMemo(() => {
    if (!dropoffDate) return [];
    const options = timeOptionsFor(dropoffDate);
    if (dropoffDate !== today) return options;
    const earliest = currentSlotInHeraklion();
    return options.filter((time) => time >= earliest);
  }, [dropoffDate, today]);
  const pickupTimeOptions = useMemo(() => {
    if (!pickupDate) return [];
    const options = timeOptionsFor(pickupDate);
    return pickupDate === dropoffDate ? options.filter((time) => time > dropoffTime) : options;
  }, [pickupDate, dropoffDate, dropoffTime]);

  const needsAdvanceBooking = useMemo(
    () => (dropoffDate && dropoffTime ? isAdvanceBookingRequired(dropoffDate, dropoffTime) : false),
    [dropoffDate, dropoffTime]
  );

  function setQuantity(size: keyof LuggageQuantities, delta: number) {
    setItems((prev) => ({ ...prev, [size]: Math.max(0, Math.min(50, prev[size] + delta)) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Mirrors the server's rules (booking-schema.ts), so a customer sees the
    // real reason here instead of a generic failure after submitting.
    const customerName = name.trim();
    const customerPhone = normalizePhone(phone);
    if (customerName.length < 2) return setError(tErr('name'));
    if (!PHONE_PATTERN.test(customerPhone)) return setError(tErr('phone'));
    if (!dropoffDate) return setError(tErr('dropoffDate'));
    if (dropoffDate < today) return setError(tErr('dateInPast'));
    if (!pickupDate) return setError(tErr('pickupDate'));
    if (pickupDate < dropoffDate) return setError(tErr('pickupBeforeDropoffDate'));
    if (!dropoffTime) return setError(tErr('dropoffTime'));
    if (!pickupTime) return setError(tErr('pickupTime'));
    if (dropoffDate === today && dropoffTime < currentSlotInHeraklion()) {
      return setError(tErr('timePassed'));
    }
    if (pickupDate === dropoffDate && pickupTime <= dropoffTime) {
      return setError(tErr('pickupBeforeDropoffTime'));
    }
    if (price.totalBags < 1) return setError(tErr('noItems'));
    if (price.totalBags > 50) return setError(tErr('tooManyBags'));

    trackBookingStarted();

    setSubmitting(true);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          dropoffDate,
          pickupDate,
          dropoffTime,
          pickupTime,
          items,
          language: locale,
          website,
        }),
      });

      if (res.status === 429) {
        setError(tErr('rateLimited'));
        return;
      }
      if (!res.ok) {
        const body = res.status === 400 ? await res.json().catch(() => null) : null;
        setError(tErr(errorKeyFor(body?.issues)));
        return;
      }

      const { reference } = await res.json();
      trackBookingCompleted({ reference, valueEuros: price.finalPriceCents / 100 });
      router.push(`/book/success/${reference}`);
    } catch {
      setError(tErr('generic'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-xs font-medium tracking-wider text-ink-500 uppercase mb-2">
            {t('form.name')}
          </label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('form.namePlaceholder')}
              autoComplete="name"
              maxLength={100}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-medium tracking-wider text-ink-500 uppercase mb-2">
            {t('form.phone')}
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('form.phonePlaceholder')}
              autoComplete="tel"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dropoffDate" className="block text-xs font-medium tracking-wider text-ink-500 uppercase mb-2">
            {t('form.dropoffDate')}
          </label>
          <div className="relative">
            <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
            <input
              id="dropoffDate"
              type="date"
              value={dropoffDate}
              min={today}
              onChange={(e) => {
                setDropoffDate(e.target.value);
                setDropoffTime('');
                setPickupTime('');
                if (pickupDate && pickupDate < e.target.value) setPickupDate(e.target.value);
              }}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="pickupDate" className="block text-xs font-medium tracking-wider text-ink-500 uppercase mb-2">
            {t('form.pickupDate')}
          </label>
          <div className="relative">
            <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
            <input
              id="pickupDate"
              type="date"
              value={pickupDate}
              min={dropoffDate || today}
              onChange={(e) => {
                setPickupDate(e.target.value);
                setPickupTime('');
              }}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {dropoffDate && pickupDate && (
        <p className="text-sm text-ink-500">
          {t('form.duration', { days: storageDays })}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dropoff" className="block text-xs font-medium tracking-wider text-ink-500 uppercase mb-2">
            {t('form.dropoffTime')}
          </label>
          <div className="relative">
            <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
            <select
              id="dropoff"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              disabled={!dropoffDate}
              className={`${inputClass} appearance-none disabled:opacity-60`}
            >
              <option value="" disabled>
                {t('form.selectTime')}
              </option>
              {dropoffTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="pickup" className="block text-xs font-medium tracking-wider text-ink-500 uppercase mb-2">
            {t('form.pickupTime')}
          </label>
          <div className="relative">
            <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
            <select
              id="pickup"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              disabled={!pickupDate}
              className={`${inputClass} appearance-none disabled:opacity-60`}
            >
              <option value="" disabled>
                {t('form.selectTime')}
              </option>
              {pickupTimeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {dropoffDate && dropoffDate === today && dropoffTimeOptions.length === 0 && (
        <p className="text-sm text-ink-500">{t('form.noTimesToday')}</p>
      )}

      {needsAdvanceBooking && (
        <div className="flex gap-3 bg-brand-50 border border-brand-500/40 p-4" role="status">
          <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 text-brand-900 mt-0.5" />
          <p className="text-sm text-ink-800">{t('form.advanceBookingWarning')}</p>
        </div>
      )}

      <div>
        <span className="block text-xs font-medium tracking-wider text-ink-500 uppercase mb-2">
          {t('form.luggageSize')}
        </span>
        <div className="space-y-3">
          {LUGGAGE_SIZES.map((size) => (
            <div
              key={size}
              className="flex items-center justify-between gap-4 py-3 px-4 border border-ink-200"
            >
              <span className="text-sm font-medium text-ink-800">{t(`form.${size}`)}</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(size, -1)}
                  aria-label={t('form.decrease', { item: t(`form.${size}`) })}
                  className="w-10 h-10 flex items-center justify-center border border-ink-200 hover:border-ink-400 transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-6 text-center font-medium" aria-live="polite">
                  {items[size]}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(size, 1)}
                  aria-label={t('form.increase', { item: t(`form.${size}`) })}
                  className="w-10 h-10 flex items-center justify-center border border-ink-200 hover:border-ink-400 transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-paper-100 p-6 space-y-2">
        <p className="text-sm font-medium tracking-wider text-ink-500 uppercase mb-1">
          {t('summary.title')}
        </p>
        <div className="flex justify-between text-ink-500 text-sm">
          <span>{t('summary.duration')}</span>
          <span>{t('form.duration', { days: price.storageDays })}</span>
        </div>
        <div className="flex justify-between text-ink-500 text-sm">
          <span>{t('summary.bags')}</span>
          <span>{price.totalBags}</span>
        </div>
        <div className="flex justify-between text-ink-600 pt-2 border-t border-ink-200">
          <span>{t('summary.original')}</span>
          <span>{formatCents(price.originalPriceCents)}</span>
        </div>
        <div className="flex justify-between text-brand-900 font-medium">
          <span>{t('summary.discount', { percent: price.discountPercentage })}</span>
          <span>-{formatCents(price.discountAmountCents)}</span>
        </div>
        <div className="flex justify-between text-ink-900 font-semibold text-lg pt-2 border-t border-ink-200">
          <span>{t('summary.final')}</span>
          <span>{formatCents(price.finalPriceCents)}</span>
        </div>
        <p className="text-xs text-ink-400 pt-1">{t('summary.paymentNote')}</p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 font-medium">
          {error}
        </p>
      )}

      <p className="text-xs text-ink-500 leading-relaxed">
        {t.rich('form.privacyNote', {
          link: (chunks) => (
            // The policy is written in EN/EL; the other languages get English.
            <Link
              href="/privacy"
              locale={isJournalLocale(locale) ? locale : 'en'}
              className="underline underline-offset-2 hover:text-ink-900"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
        {submitting ? t('form.submitting') : t('form.submit')}
      </button>
    </form>
  );
}
