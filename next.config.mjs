/** @type {import('next').NextConfig} */
// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  env: {
    TOKEN_EXPIRY: process.env.TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    OTP_EXPIRY: process.env.OTP_EXPIRY,
  },
  // Changed from experimental.serverComponentsExternalPackages to serverExternalPackages
  serverExternalPackages: ['jsonwebtoken'],
  // You need to explicitly allow the public key for Edge
  publicRuntimeConfig: {
    PUBLIC_KEY: process.env.PUBLIC_KEY,
  },
};

export default nextConfig;