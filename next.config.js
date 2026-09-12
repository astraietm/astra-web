const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
