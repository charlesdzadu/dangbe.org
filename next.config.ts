import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* Self-contained server bundle: harmless on Vercel, required for the Docker exit door. */
  output: 'standalone',
  /* `pnpm build` while `pnpm dev` runs would fight over .next; CI and local
   * checks can build elsewhere: NEXT_BUILD_DIR=.next-check pnpm build */
  distDir: process.env.NEXT_BUILD_DIR ?? '.next',
  poweredByHeader: false,
  /* The Open Graph renderer reads two TTF files at request time. */
  outputFileTracingIncludes: { '/**/opengraph-image': ['./src/fonts/*.ttf'] },
};

export default nextConfig;
