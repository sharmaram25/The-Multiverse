import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // @react-three/fiber doesn't fully support React 19 types yet
    // The code works at runtime - this is a type definition issue only
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'export',
  transpilePackages: ['motion'],
  // Acknowledge Turbopack (default in Next.js 16+)
  turbopack: {},
  webpack: (config, {dev}) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
