import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer (CV generation) ships its own font/stream internals;
  // keep it out of the bundler so it runs as a normal Node dependency.
  serverExternalPackages: ["@react-pdf/renderer"],

  // Next.js dev server blocks cross-origin requests to dev-only assets/endpoints
  // by default. Allow the origins you tunnel/expose the dev server through so
  // JS chunks, HMR, and RSC payloads load (otherwise only the shell renders).
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
    "*.ngrok-free.dev",
    // Add your machine's LAN/public IP here if accessing by IP, e.g. "192.168.1.50"
  ],
};

export default nextConfig;
