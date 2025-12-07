import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
    ],
  },
};

const withMDX = createMDX({
  // options: {
  //     remarkPlugins: [],
  //     rehypePlugins: [['rehype-katex', { strict: true, throwOnError: true }]],
  // },
});

export default withMDX(nextConfig);
