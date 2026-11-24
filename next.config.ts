// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.0.4",      // <-- your phone/device IP (from the error)
    "192.168.43.150",   // <-- your earlier network URL
    "192.168.137.1",    // <-- Windows hotspot default
    "0.0.0.0",
  ],
};

export default nextConfig;