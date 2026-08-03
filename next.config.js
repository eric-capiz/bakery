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
      { source: "/gallery", destination: "/portfolio", permanent: true },
      { source: "/pieces", destination: "/portfolio", permanent: true },
      { source: "/work", destination: "/portfolio", permanent: true },
      { source: "/collection", destination: "/portfolio", permanent: true },
      { source: "/sample-cakes", destination: "/portfolio", permanent: true },
      { source: "/about", destination: "/practice", permanent: true },
      { source: "/atelier", destination: "/practice", permanent: true },
      { source: "/studio", destination: "/practice", permanent: true },
      { source: "/story", destination: "/practice", permanent: true },
      { source: "/house", destination: "/practice", permanent: true },
      { source: "/reviews", destination: "/praise", permanent: true },
      { source: "/voices", destination: "/praise", permanent: true },
      { source: "/letters", destination: "/praise", permanent: true },
      { source: "/notes", destination: "/praise", permanent: true },
      { source: "/words", destination: "/praise", permanent: true },
      { source: "/booking", destination: "/commission", permanent: true },
      { source: "/consult", destination: "/commission", permanent: true },
      { source: "/enquire", destination: "/commission", permanent: true },
      { source: "/visit", destination: "/commission", permanent: true },
      { source: "/book", destination: "/commission", permanent: true },
      { source: "/reserve", destination: "/commission", permanent: true },
      { source: "/contact", destination: "/commission", permanent: true },
    ];
  },
};

module.exports = nextConfig;
