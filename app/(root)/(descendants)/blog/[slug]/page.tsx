import BlogContent from "@/components/blog/content";
import { getBlogPosts, getSingleBlogPost } from "@/lib/blog";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getSingleBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogContent post={post} />;
}

export function generateStaticParams() {
  return getBlogPosts().map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;
