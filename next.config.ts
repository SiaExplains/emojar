import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  async redirects() {
    return [
      // NOTE: www → non-www redirect must be configured in the Vercel dashboard
      // (Domains → set emojar.com as primary, www.emojar.com as redirect).
      // Do NOT handle it here — Next.js host-based redirects cause redirect loops
      // on Vercel.

      { source: '/collections', destination: '/collection', permanent: true },
      {
        source: '/collections/alphabet',
        destination: '/collection/alphabet',
        permanent: true,
      },
      {
        source: '/collections/detail',
        destination: '/collection/detail',
        permanent: true,
      },
      { source: '/sorted', destination: '/collection', permanent: true },
      {
        source: '/sorted/alphabet',
        destination: '/collection/alphabet',
        permanent: true,
      },
      {
        source: '/sorted/detail',
        destination: '/collection/detail',
        permanent: true,
      },
    ];
  },
};

export default withMDX(nextConfig);
