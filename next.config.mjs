import createMDX from "@next/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm, [remarkToc, {
      heading: "(table[ -]of[ -])?目录?|toc",
    }]],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
    ],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
