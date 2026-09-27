export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const business = {
  name: 'Luggage Storage Heraklion City Center',
  streetAddress: 'Sfakianaki 4',
  postalCode: '71201',
  addressLocality: 'Heraklion',
  addressRegion: 'Crete',
  addressCountry: 'GR',
  phone: '+306951508538',
  phoneDisplay: '+30 695 150 8538',
  whatsapp: '+306951508538',
} as const;

/** Verified Google Maps coordinates for the business location. */
export const geo = {
  latitude: 35.337821149454264,
  longitude: 25.130352530204426,
} as const;

export const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${business.name}, ${business.streetAddress}, ${business.postalCode} ${business.addressLocality}, ${business.addressRegion}, Greece`
)}`;

/** Google Place ID of the business listing (derived from its Maps feature
 * ID 0x149a5be4c1fb1477:0x8bc723a539909944 and verified to open it). */
const googlePlaceId = 'ChIJdxT7weRbmhQRRJmQOaUjx4s';

/** Opens the listing's Google reviews — readable without signing in. */
export const googleReviewsUrl = `https://search.google.com/local/reviews?placeid=${googlePlaceId}`;

/** Official profiles elsewhere (Google Business Profile, TripAdvisor,
 * social media). Listed as `sameAs` in the structured data so search
 * engines and AI assistants can tie them to this site. */
export const profileUrls: string[] = [
  'https://share.google/nVFDyNh1VDy7mi2za', // Google Business Profile
];

export const telHref = `tel:${business.phone}`;
export const whatsappHref = `https://wa.me/${business.whatsapp.replace(/\+/g, '')}`;
