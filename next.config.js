/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Maximizes compatibility with Cloudflare CDN, AWS S3/CloudFront and static export
  },
};

module.exports = nextConfig;
