/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true,
  },
  async redirects() {
    return [
      // Task 0.2: Enforce canonical domain — www → non-www (permanent 301)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.emojar.com' }],
        destination: 'https://emojar.com/:path*',
        permanent: true,
      },
      // Task 0.5: Redirect all old /collections and /sorted routes → /collection
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

export default nextConfig;
