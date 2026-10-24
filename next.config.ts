import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  serverExternalPackages: [
    "@libsql/client",
    "@libsql/hrana-client",
    "libsql",
  ],
};

export default nextConfig;
