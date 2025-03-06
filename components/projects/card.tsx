"use client"

import Project from "@/types/project";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {MagicCard} from "@/components/magicui/magic-card";
import Link from "next/link";
import {useTheme} from "next-themes";

export default function ProjectCard({ project }: { project: Project } ) {
  const { theme } = useTheme();

  return (
    <Link href={project.url} key={project.slug}>
      <Card className={"p-0 h-full"}>
        <MagicCard className={"h-full"} gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}>
          <CardHeader className={"py-6"}>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
        </MagicCard>
      </Card>
    </Link>
  )
}