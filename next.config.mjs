/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: '12mb' } } // photo uploads from the sell form
};
export default nextConfig;
