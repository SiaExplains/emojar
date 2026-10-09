import { ImageResponse } from 'next/og';
import { EMOJI_COUNT_LABEL } from '@/lib/emoji-count';
import { TOOLS } from '@/lib/online-tools/registry';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Emojar — Free Online Tools, Emoji Search & Games';

export default function OgImage() {
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
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
          gap: '24px',
        }}
      >
        <div style={{ fontSize: 96, lineHeight: 1 }}>🛠️😊🎮</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#0f172a',
            textAlign: 'center',
            lineHeight: 1.15,
          }}
        >
          Emojar
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#475569',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {`${TOOLS.length} free online tools · ${EMOJI_COUNT_LABEL} emojis · 18 games`}
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#94a3b8',
            marginTop: 8,
          }}
        >
          emojar.com
        </div>
      </div>
    ),
    { ...size },
  );
}
