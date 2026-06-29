import { ImageResponse } from 'next/og';

export const alt = 'Environmental Managers Association of BC';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #11472f 0%, #133247 100%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.85, marginBottom: 16 }}>Environmental Managers Association of BC</div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 900 }}>
          Advancing environmental excellence across BC
        </div>
        <div style={{ fontSize: 24, marginTop: 32, opacity: 0.8 }}>
          Membership · Events · Professional Development
        </div>
      </div>
    ),
    { ...size }
  );
}
