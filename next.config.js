/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:fs': false,
      'node:path': false,
    };
    return config;
  },
}

module.exports = nextConfig