import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      enabled: false,
    },
  },
  allowedDevOrigins: ['http://9003-firebase-studio-1752416218624.cluster-6frnii43o5blcu522sivebzpii.cloudworkstations.dev'],
};

export default nextConfig;
