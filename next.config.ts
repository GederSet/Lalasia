import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['front-school.minio.ktsdev.ru'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
