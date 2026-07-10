import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  // Permite ao next/image otimizar/redimensionar as fotos dos medidores
  // servidas pelo Supabase Storage (fotos de celular são pesadas).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "agtmkimpwdgsgpevrgld.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
