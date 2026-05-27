/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@landup/ui', '@landup/types', '@landup/db', '@landup/ai'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudflare.com' },
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
}

export default nextConfig
