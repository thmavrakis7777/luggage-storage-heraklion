import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: number;
  priority?: boolean;
}

export function Logo({ className = '', size = 44, priority = false }: LogoProps) {
  return (
    <Image
      src="/logo.jpg"
      alt="Luggage Storage Heraklion City Center"
      width={size}
      height={size}
      priority={priority}
      className={`rounded-sm ${className}`}
    />
  );
}
