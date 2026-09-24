'use client';

import { useState } from 'react';

interface MapEmbedProps {
  src: string;
  title: string;
  /** Server-rendered placeholder shown until the visitor asks for the map. */
  children: React.ReactNode;
}

/**
 * Google Maps loads only when the visitor taps the placeholder. Even lazy,
 * the embed cost ~45 requests / ~710 KB the moment it scrolled into view —
 * more than the rest of the homepage — and most visitors never use it (the
 * address, directions link and buttons sit right next to it).
 */
export function MapEmbed({ src, title, children }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        // Keeps keyboard focus on the map instead of dropping it when the
        // button it replaces unmounts.
        ref={(el) => el?.focus()}
        title={title}
        src={src}
        className="w-full h-full grayscale-[20%]"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <button
      type="button"
      data-map-load
      onClick={() => setLoaded(true)}
      className="group block w-full h-full cursor-pointer"
    >
      {children}
    </button>
  );
}
