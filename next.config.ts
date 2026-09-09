/** @type {import('next').NextConfig} */
const nextConfig: Record<string, unknown> = {
  /* config options here */
  allowedDevOrigins: ["192.168.100.40", "localhost:3000"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "512mb",
    },
  },
};

export default nextConfig;
