// Minimal ICO writer. Each entry stores a PNG, which every current browser and
// Windows Vista+ accept inside .ico files.

export function buildIco(
  images: { size: number; png: Uint8Array }[],
): Uint8Array {
  if (!images.length) throw new Error('An ICO file needs at least one image.');
  const headerSize = 6 + 16 * images.length;
  const total = headerSize + images.reduce((n, i) => n + i.png.length, 0);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, images.length, true);
  let offset = headerSize;
  images.forEach((img, i) => {
    const e = 6 + i * 16;
    const dim = img.size >= 256 ? 0 : img.size; // 0 means 256
    out[e] = dim;
    out[e + 1] = dim;
    out[e + 2] = 0; // palette colours
    out[e + 3] = 0; // reserved
    view.setUint16(e + 4, 1, true); // colour planes
    view.setUint16(e + 6, 32, true); // bits per pixel
    view.setUint32(e + 8, img.png.length, true);
    view.setUint32(e + 12, offset, true);
    out.set(img.png, offset);
    offset += img.png.length;
  });
  return out;
}

export const FAVICON_ICO_SIZES = [16, 32, 48];

export function faviconHtml(opts: {
  name: string;
  themeColor: string;
}): string {
  return [
    '<link rel="icon" href="/favicon.ico" sizes="48x48">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    `<meta name="theme-color" content="${/^#[0-9a-f]{3,8}$/i.test(opts.themeColor) ? opts.themeColor : '#ffffff'}">`,
  ].join('\n');
}

export function webManifest(opts: {
  name: string;
  themeColor: string;
  backgroundColor: string;
}): string {
  return JSON.stringify(
    {
      name: opts.name,
      short_name: opts.name,
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      theme_color: opts.themeColor,
      background_color: opts.backgroundColor,
      display: 'standalone',
    },
    null,
    2,
  );
}
