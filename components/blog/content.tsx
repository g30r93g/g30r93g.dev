import BlogPost from "@/types/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function BlogContent({ post }: { post: BlogPost }) {
  return (
    <article className={"container mx-auto"}>
      <header className={"flex flex-col gap-3"}>
        <h1 className={"font-medium text-3xl"}>{post.title}</h1>
        {post.description && (
          <p className={"text-muted-foreground text-lg"}>{post.description}</p>
        )}
        <div
          className={
            "flex flex-wrap items-center gap-3 text-muted-foreground text-sm"
          }
        >
          <time dateTime={post.publishedDate.toISOString()}>
            {format(post.publishedDate, "MMMM d, yyyy")}
          </time>
          {post.updatedDate && (
            <span>· Updated {format(post.updatedDate, "MMMM d, yyyy")}</span>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className={"flex flex-wrap gap-2"}>
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={"outline"}
                  className={"bg-muted/50 rounded-full h-fit"}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className={"mt-8 prose prose-neutral dark:prose-invert max-w-none"}>
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
