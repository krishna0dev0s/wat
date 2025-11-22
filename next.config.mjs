/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "i.imghippo.com",
      },
    ],
  },
  experimental: {
    turbopack: false,
  },
};

export default nextConfig;
