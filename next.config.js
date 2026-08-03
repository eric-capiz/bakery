/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ["./src/styles"],
  },
  devIndicators: {
    position: "bottom-left",
  },
  async redirects() {
    return [
      { source: "/gallery", destination: "/services", permanent: true },
      { source: "/portfolio", destination: "/services", permanent: true },
      { source: "/pieces", destination: "/services", permanent: true },
      { source: "/work", destination: "/services", permanent: true },
      { source: "/sample-cakes", destination: "/services", permanent: true },
      { source: "/collection", destination: "/services", permanent: true },
      { source: "/contact", destination: "/book", permanent: true },
      { source: "/atelier", destination: "/about", permanent: true },
      { source: "/studio", destination: "/about", permanent: true },
      { source: "/practice", destination: "/about", permanent: true },
      { source: "/story", destination: "/about", permanent: true },
      { source: "/house", destination: "/about", permanent: true },
      { source: "/voices", destination: "/reviews", permanent: true },
      { source: "/letters", destination: "/reviews", permanent: true },
      { source: "/notes", destination: "/reviews", permanent: true },
      { source: "/words", destination: "/reviews", permanent: true },
      { source: "/praise", destination: "/reviews", permanent: true },
      { source: "/booking", destination: "/book", permanent: true },
      { source: "/consult", destination: "/book", permanent: true },
      { source: "/enquire", destination: "/book", permanent: true },
      { source: "/commission", destination: "/book", permanent: true },
      { source: "/visit", destination: "/book", permanent: true },
      { source: "/reserve", destination: "/book", permanent: true },
    ];
  },
};

module.exports = nextConfig;
