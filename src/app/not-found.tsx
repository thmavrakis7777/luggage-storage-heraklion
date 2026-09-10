import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/ui/NotFoundContent';
import './globals.css';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Root-level catch-all for every 404 (a broken link under a locale like
 * /en/typo, an invalid locale segment, or a fully unprefixed bad URL) — see
 * NotFoundContent for why. Deliberately a plain static Server Component
 * itself (no request-scoped locale detection here) so this file can't force
 * the rest of the app out of static generation.
 */
export default function NotFound() {
  return <NotFoundContent />;
}
