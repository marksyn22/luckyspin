import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  async redirects() {
    return [

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
