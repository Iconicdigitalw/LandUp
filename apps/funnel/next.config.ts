import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@landup/ui', '@landup/types'],
}

export default nextConfig
