import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['front-school.minio.ktsdev.ru'],
  },
}

export default nextConfig
