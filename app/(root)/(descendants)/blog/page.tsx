import BlogList from "@/components/blog/list";
import { getBlogPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className={"container mx-auto pt-16"}>
      <h1 id={"blog"} className={"font-mono font-medium text-2xl mt-8 mb-4"}>
        Blog
      </h1>
      <BlogList posts={posts} />
    </div>
  );
}
