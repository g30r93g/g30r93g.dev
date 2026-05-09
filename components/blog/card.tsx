"use client";

import BlogPost from "@/types/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function BlogCard({ post }: { post: BlogPost }) {
  const { theme } = useTheme();

  return (
    <Link href={post.url} key={post.slug}>
      <Card className={"p-0 h-full bg-accent/50 dark:bg-accent/35"}>
        <MagicCard
          className={"h-full"}
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          <div className={"grid grid-cols-[1fr_auto] gap-4"}>
            <CardHeader className={"py-6"}>
              <div className={"flex flex-col gap-2"}>
                <CardTitle>{post.title}</CardTitle>
                {post.description && (
                  <CardDescription>{post.description}</CardDescription>
                )}
              </div>
            </CardHeader>
            <Badge
              className={"bg-muted/50 mt-4 mr-4 rounded-full h-fit"}
              variant={"outline"}
            >
              {format(post.publishedDate, "MMM d, yyyy")}
            </Badge>
          </div>
          {post.tags && post.tags.length > 0 && (
            <CardContent
              className={
                "pb-4 text-muted-foreground text-sm flex flex-col gap-2"
              }
            >
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
            </CardContent>
          )}
        </MagicCard>
      </Card>
    </Link>
  );
}
