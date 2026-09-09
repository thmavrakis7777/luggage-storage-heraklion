import { useTranslations } from 'next-intl';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';

export function WalkInNotice() {
  const t = useTranslations('walkIn');

  return (
    <div className="bg-paper-100 border-y border-ink-100">
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-shrink-0">
            <CheckBadgeIcon className="w-5 h-5 text-brand-800" />
            <span className="font-medium text-ink-900">{t('title')}</span>
          </div>
          <span className="hidden sm:block w-px h-4 bg-ink-200" />
          <p className="text-sm text-ink-500">{t('subtitle')}</p>
        </div>
      </div>
    </div>
  );
}
