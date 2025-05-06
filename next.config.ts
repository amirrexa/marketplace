/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {}
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptomized: true,
  }
}
export default nextConfig;
