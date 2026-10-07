import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'emoji';
  const emoji = searchParams.get('emoji') ?? '😀';
  const name = searchParams.get('name') ?? 'Emoji';

  if (type === 'tool') {
    const desc = (searchParams.get('desc') ?? '').slice(0, 140);
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)',
            fontFamily: 'system-ui, sans-serif',
            padding: '72px',
          }}
        >
          <div style={{ fontSize: 110, lineHeight: 1, marginBottom: 28 }}>
            {emoji}
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            {name.slice(0, 60)}
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#475569',
              lineHeight: 1.35,
              marginBottom: 36,
            }}
          >
            {desc}
          </div>
          <div style={{ fontSize: 26, color: '#4f46e5', fontWeight: 600 }}>
            Free · runs in your browser · emojar.com
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  if (type === 'category') {
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
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            fontFamily: 'system-ui, sans-serif',
            padding: '60px',
          }}
        >
          <div style={{ fontSize: 100, marginBottom: 32, lineHeight: 1 }}>
            {'🏷️'}
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#0f172a',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            {name} Emojis
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            Browse, copy and paste — emojar.com
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  // Default: single emoji card
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
          background: 'linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%)',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 160, lineHeight: 1, marginBottom: 32 }}>
          {emoji}
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#0f172a',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 20,
            textTransform: 'capitalize',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 26,
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          Copy, meaning &amp; details — emojar.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
