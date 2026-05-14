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
      // Task 0.5: Redirect renamed /collections routes → /sorted (permanent 301)
      { source: '/collections', destination: '/sorted', permanent: true },
      {
        source: '/collections/alphabet',
        destination: '/sorted/alphabet',
        permanent: true,
      },
      {
        source: '/collections/detail',
        destination: '/sorted/detail',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
