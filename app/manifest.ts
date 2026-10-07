import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Emojar — Free Online Tools',
    description:
      'Free, privacy-friendly online tools that run in your browser — plus emoji search and copy.',
    short_name: 'Emojar',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#111827',
    icons: [
      { src: '/android-icon-36x36.png', sizes: '36x36', type: 'image/png' },
      { src: '/android-icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { src: '/android-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { src: '/android-icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { src: '/android-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { src: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
