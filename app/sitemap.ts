import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog";
import { getExperience } from "@/lib/experience";

const SITE = "https://g30r93g.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getBlogPosts().filter((post) => !post.draft);
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    ...getExperience().map((e) => ({ url: `${SITE}${e.url}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...(posts.length ? [{ url: `${SITE}/blog`, changeFrequency: "weekly" as const, priority: 0.5 }] : []),
    ...posts.map((post) => ({
      url: `${SITE}${post.url}`,
      lastModified: post.updatedDate ?? post.publishedDate,
      priority: 0.5,
    })),
  ];
}
