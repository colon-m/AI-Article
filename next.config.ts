import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // swcMinify: false,
  // experimental: {
  //   forceSwcTransforms: false,
  // },
};
const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);


