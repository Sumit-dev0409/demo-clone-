/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "puppy.instabizweb.com",
      },
    ],
  },
};

export default nextConfig;