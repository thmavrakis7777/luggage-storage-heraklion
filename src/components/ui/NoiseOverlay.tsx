interface NoiseOverlayProps {
  opacity?: number;
  /**
   * Non-'normal' blend modes force the browser to create an isolated
   * compositing layer for this element — expensive when, as here, the
   * element spans the full scrollable page height. Defaults to 'normal'
   * (no special blending) to keep the texture essentially free to paint.
   */
  blendMode?: string;
  className?: string;
}

export function NoiseOverlay({ opacity = 0.06, blendMode = 'normal', className = '' }: NoiseOverlayProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'],
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' seed='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }}
      aria-hidden="true"
    />
  );
}
