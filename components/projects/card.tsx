"use client";

import Project from "@/types/project";
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
import { clsx } from "clsx";
import { format } from "date-fns";

export default function ProjectCard({ project }: { project: Project }) {
  const { theme } = useTheme();

  return (
    <Link
      href={project.url}
      key={project.slug}
      referrerPolicy={"no-referrer"}
      target={"_blank"}
    >
      <Card className={"p-0 h-full bg-accent/50 dark:bg-accent/35"}>
        <MagicCard
          className={"h-full"}
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          <div className={"grid grid-cols-[1fr_auto] gap-4"}>
            <CardHeader className={"py-6"}>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <Badge
              className={clsx("bg-muted/50 mt-4 mr-4 rounded-full h-fit", {
                "bg-green-100 dark:bg-green-950 border-green-400 dark:border-green-700":
                  project.status === "Completed",
                "bg-blue-100 dark:bg-blue-950 border-blue-400 dark:border-blue-800":
                  project.status === "In Progress",
                "bg-orange-200 dark:bg-orange-950 border-orange-500 dark:border-orange-600":
                  project.status === "Archived",
                "bg-red-200 dark:bg-red-950 border-red-500 dark:border-red-700":
                  project.status === "On Hold",
              })}
              variant={"outline"}
            >
              {project.status}
            </Badge>
          </div>
          <CardContent
            className={"pb-4 text-muted-foreground text-sm flex flex-col gap-2"}
          >
            {project.releaseDate && (
              <span>
                Release Date:{" "}
                <strong className={"font-mono"}>
                  {format(project.releaseDate, "dd/MM/yyyy")}
                </strong>
              </span>
            )}
            {project.technologies && (
              <div className={"grid grid-cols-[auto_1fr] gap-2"}>
                <span>{project.releaseDate ? "Built" : "Building"} With:</span>
                <div className={"flex flex-wrap gap-2"}>
                  {project.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant={"outline"}
                      className={"bg-muted/50 rounded-full h-fit"}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </MagicCard>
      </Card>
    </Link>
  );
}
