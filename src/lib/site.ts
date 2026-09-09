export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const business = {
  name: 'Luggage Storage Heraklion City Center',
  legalName: 'Luggage Storage Heraklion City Center',
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

export const telHref = `tel:${business.phone}`;
export const whatsappHref = `https://wa.me/${business.whatsapp.replace(/\+/g, '')}`;
