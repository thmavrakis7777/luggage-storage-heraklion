export const locales = ['en', 'el', 'de', 'it', 'es', 'nl', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  el: 'Ελληνικά',
  de: 'Deutsch',
  it: 'Italiano',
  es: 'Español',
  nl: 'Nederlands',
  fr: 'Français',
};
