/**
 * The visitor's cookie choice for Google Analytics — the only non-essential
 * cookies on the site. Greek law (L. 3471/2006 art. 4(5), the ePrivacy
 * rule) requires asking before they are set, so nothing analytics-related
 * loads until this says 'granted'.
 *
 * Stored in localStorage (strictly necessary: it only remembers the answer)
 * and asked again after six months. If storage is blocked, the choice lasts
 * for the current page session instead, and nothing ever throws.
 */

export type ConsentChoice = 'granted' | 'denied';

const STORAGE_KEY = 'cookie-consent';
const CHANGE_EVENT = 'cookie-consent-change';
const MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;

let memoryChoice: ConsentChoice | null = null;
let settingsOpen = false;

/** The saved choice, or null if the visitor hasn't answered (or it expired). */
export function getConsent(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { choice, at } = JSON.parse(raw);
      if ((choice === 'granted' || choice === 'denied') && Date.now() - at < MAX_AGE_MS) {
        return choice;
      }
    }
  } catch {
    // Blocked or malformed storage — fall back to this session's answer.
  }
  return memoryChoice;
}

export function setConsent(choice: ConsentChoice) {
  const previous = getConsent();
  memoryChoice = choice;
  settingsOpen = false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, at: Date.now() }));
  } catch {
    // Remembered for this session only.
  }

  // Withdrawing consent: gtag.js can't be unloaded once running, so remove
  // its cookies and reload — the fresh page never loads it.
  if (previous === 'granted' && choice === 'denied') {
    clearAnalyticsCookies();
    window.location.reload();
    return;
  }
  notify();
}

/** Re-opens the banner (the footer's "Cookie settings" link). */
export function openCookieSettings() {
  settingsOpen = true;
  notify();
}

export function isCookieSettingsOpen() {
  return settingsOpen;
}

/** For useSyncExternalStore; also picks up changes made in other tabs. */
export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function notify() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Deletes _ga and _ga_* on the current host and every parent domain, since
 * GA sets them on the top-level domain (e.g. .luggagestorage-heraklion.com). */
function clearAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  const parts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i++) {
    domains.push(`; domain=.${parts.slice(i).join('.')}`);
  }
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}
