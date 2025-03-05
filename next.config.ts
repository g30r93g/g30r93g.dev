import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
    /* config options here */
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
    // options: {
    //     remarkPlugins: [],
    //     rehypePlugins: [['rehype-katex', { strict: true, throwOnError: true }]],
    // },
})

export default withMDX(nextConfig);
