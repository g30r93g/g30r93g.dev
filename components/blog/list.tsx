import BlogCard from "@/components/blog/card";
import type BlogPost from "@/types/blog";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <p className={"text-muted-foreground"}>No posts yet — check back soon.</p>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
