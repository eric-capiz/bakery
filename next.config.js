/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  devIndicators: {
    position: 'bottom-left',
  },
}

module.exports = nextConfig

