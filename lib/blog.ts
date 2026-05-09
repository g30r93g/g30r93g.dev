import { getMdx, getMdxList } from "@/lib/get-mdx";
import BlogPost from "@/types/blog";
import path from "path";
import { z } from "zod";

const blogDirectory = path.join(process.cwd(), "/content/blog");

const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  publishedYear: z.number(),
  publishedMonth: z.number(),
  publishedDay: z.number(),
  updatedYear: z.number().optional(),
  updatedMonth: z.number().optional(),
  updatedDay: z.number().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
});

const blogMapper = (
  data: z.infer<typeof blogSchema>,
  content: string,
  slug: string,
): BlogPost => ({
  title: data.title,
  description: data.description,
  slug,
  url: `/blog/${slug}`,
  publishedDate: new Date(
    `${data.publishedYear}-${data.publishedMonth}-${data.publishedDay}`,
  ),
  updatedDate:
    data.updatedYear && data.updatedMonth && data.updatedDay
      ? new Date(`${data.updatedYear}-${data.updatedMonth}-${data.updatedDay}`)
      : undefined,
  tags: data.tags,
  draft: data.draft ?? false,
  content,
});

export function getBlogPosts(): BlogPost[] {
  const posts = getMdxList<BlogPost, typeof blogSchema>(
    blogDirectory,
    blogSchema,
    blogMapper,
  );

  const includeDrafts = process.env.NODE_ENV === "development";

  return posts
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
}

export function getSingleBlogPost(slug: string): BlogPost | undefined {
  return getMdx<BlogPost, typeof blogSchema>(
    blogDirectory,
    blogSchema,
    blogMapper,
    slug,
  );
}
