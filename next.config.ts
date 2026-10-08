import createMDX from '@next/mdx';

// Plugins are referenced by package name so the options stay serialisable,
// which Turbopack (`next dev --turbopack`) requires.
const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm', {}]],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  // Tool guides are read from disk when pages (re)render — including daily
  // ISR revalidations on Vercel — so ship the Markdown with every function.
  outputFileTracingIncludes: {
    '/**/*': ['./content/guides/**/*.md'],
  },
  // qpdf-wasm's Emscripten glue references Node built-ins it only uses under
  // Node; stub them in browser bundles — for Turbopack (`next dev`) here and
  // for webpack (`next build`) below.
  turbopack: {
    resolveAlias: {
      fs: { browser: './lib/stubs/empty.ts' },
      path: { browser: './lib/stubs/empty.ts' },
    },
  },
  webpack: (
    config: { resolve: { fallback?: Record<string, false> } },
    { isServer }: { isServer: boolean },
  ) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  async redirects() {
    return [
      // NOTE: www → non-www redirect must be configured in the Vercel dashboard
      // (Domains → set emojar.com as primary, www.emojar.com as redirect).
      // Do NOT handle it here — Next.js host-based redirects cause redirect loops
      // on Vercel.

      // Online tools: common misspellings and shortcuts → canonical URLs.
      {
        source: '/online-tool/image-convertor',
        destination: '/online-tool/image-tools/image-converter',
        permanent: true,
      },
      {
        source: '/online-tool/image-converter',
        destination: '/online-tool/image-tools/image-converter',
        permanent: true,
      },
      {
        source: '/online-tool/image-tools/image-convertor',
        destination: '/online-tool/image-tools/image-converter',
        permanent: true,
      },
      {
        source: '/online-tool/image-tools/image-converter/:pair(.+)-convertor',
        destination: '/online-tool/image-tools/image-converter/:pair-converter',
        permanent: true,
      },
      {
        source: '/online-tools/:path*',
        destination: '/online-tool/:path*',
        permanent: true,
      },

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
