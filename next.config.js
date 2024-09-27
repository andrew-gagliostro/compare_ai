/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["md-to-pdf", "@sparticuz/chromium"],
  },
};

module.exports = nextConfig;
