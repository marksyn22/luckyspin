import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const publicSupabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const publicSupabaseAnon = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const publicLwDev = process.env.VITE_LUCKY_WHEEL_DEV_MODE ?? process.env.NEXT_PUBLIC_LUCKY_WHEEL_DEV_MODE ?? '';

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/zh/wheel', destination: '/zh/lucky-wheel', permanent: true },
      { source: '/ms/wheel', destination: '/ms/lucky-wheel', permanent: true },
    ];
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: publicSupabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: publicSupabaseAnon,
    NEXT_PUBLIC_LUCKY_WHEEL_DEV_MODE: publicLwDev,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY:
      process.env.VITE_TURNSTILE_SITE_KEY ?? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
  },
};

export default nextConfig;
