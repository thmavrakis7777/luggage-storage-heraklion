'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  intensity?: number;
}

export function TiltCard({ children, intensity = 0.4 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const glareRef = useRef<HTMLDivElement>(null);
  const updateRef = useRef<() => void>(() => {});

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const update = useCallback(() => {
    const lf = hovering ? 0.1 : 0.06;
    current.current.x = lerp(current.current.x, target.current.x, lf);
    current.current.y = lerp(current.current.y, target.current.y, lf);

    const settled =
      !hovering &&
      Math.abs(current.current.x - target.current.x) < 0.001 &&
      Math.abs(current.current.y - target.current.y) < 0.001;

    const { x, y } = current.current;
    const rY = x * 6 * intensity;
    const rX = -y * 6 * intensity;

    if (ref.current) {
      ref.current.style.transform = `perspective(1200px) rotateX(${rX}deg) rotateY(${rY}deg)`;
    }

    if (glareRef.current) {
      const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      glareRef.current.style.opacity = hovering ? '0.15' : '0';
      glareRef.current.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.25) 0%, transparent 80%)`;
    }

    if (settled) {
      rafId.current = null;
      return;
    }
    rafId.current = requestAnimationFrame(() => updateRef.current());
  }, [hovering, intensity]);

  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    if (hovering || target.current.x !== 0 || target.current.y !== 0) {
      if (!rafId.current) rafId.current = requestAnimationFrame(() => updateRef.current());
    }
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [hovering, update]);

  // Skip the tilt effect entirely on touch/coarse pointers (it has no
  // meaningful hover state there) and when the user prefers reduced motion.
  const canTilt = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  const onPointerEnter = useCallback(() => {
    if (canTilt()) setHovering(true);
  }, [canTilt]);
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!ref.current || !canTilt()) return;
      const rect = ref.current.getBoundingClientRect();
      target.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      target.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    },
    [canTilt]
  );
  const onPointerLeave = useCallback(() => {
    setHovering(false);
    target.current.x = 0;
    target.current.y = 0;
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        willChange: hovering ? 'transform' : undefined,
      }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
      <div
        ref={glareRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.3s',
          zIndex: 10,
        }}
      />
    </div>
  );
}
