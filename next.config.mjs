import analyzer from '@next/bundle-analyzer';
import nextPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';
const buildWithDocker = process.env.DOCKER === 'true';

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // not sure why antd-style cause multi ThemeProvider instance
  // So we need to transpile it to lib mode
  transpilePackages: ['@lobehub/ui', 'antd-style'],
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },

  env: {
    AGENTS_INDEX_URL: process.env.AGENTS_INDEX_URL,
    PLUGINS_INDEX_URL: process.env.PLUGINS_INDEX_URL,
  },

  output: buildWithDocker ? 'standalone' : undefined,
};

export default isProd ? withBundleAnalyzer(withPWA(nextConfig)) : nextConfig;
