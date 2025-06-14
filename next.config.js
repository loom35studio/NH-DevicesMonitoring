/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias['@routes'] = path.resolve(__dirname, 'routes');
    return config;
  },
};

module.exports = nextConfig;
