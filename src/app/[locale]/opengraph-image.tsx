import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { business } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const logoData = await readFile(join(process.cwd(), 'public', 'logo.jpg'));
  const logoSrc = `data:image/jpeg;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#100e0c',
          backgroundImage:
            'radial-gradient(ellipse at top right, rgba(255,214,0,0.18), transparent 55%)',
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={140}
          height={140}
          style={{ borderRadius: 12, marginBottom: 48 }}
        />
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {business.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: '#ffd600',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Book Online & Save 10%
        </div>
      </div>
    ),
    { ...size }
  );
}
