/** @type {import('next').NextConfig} */
const nextConfig: Record<string, unknown> = {
  allowedDevOrigins: ["192.168.100.40", "localhost:3000"],
  images: {
    // El backend local corre en 9090 (ver server.port en application.yaml del
    // backend), no en 8080: con el puerto viejo las imagenes servidas por la
    // API fallaban en local.
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9090",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9090",
      },
      // Imagenes y trailers subidos directo a Cloudflare R2.
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      // Render sirve el backend en https://<servicio>.onrender.com. El nombre
      // exacto se decide al crear el Web Service, asi que se cubre el dominio
      // entero en vez de hardcodear un host que todavia no existe.
      {
        protocol: "https",
        hostname: "*.onrender.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Solo aplica en desarrollo. En Vercel la peticion se corta en 4.5MB
      // aunque se declare un limite mayor, por eso la media grande ya no
      // viaja por Server Actions: se sube con URL prefirmada directo a R2.
      bodySizeLimit: "512mb",
    },
  },
};

export default nextConfig;
