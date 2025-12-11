"use client";

import ProjectCard from "@/components/projects/card";
import type Project from "@/types/project";
import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

type TabValue = "flagship" | "all";

export default function ProjectsList({
  projects,
  initialTab = "flagship",
}: {
  projects: Project[];
  initialTab?: TabValue;
}) {
  const [selectedTab, setSelectedTab] = useState<TabValue>(initialTab);

  const visible = useMemo(() => {
    if (selectedTab === "all") return projects;
    return projects.filter((project) => project.highlight);
  }, [projects, selectedTab]);

  return (
    <>
      <Tabs
        className="w-fit"
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as TabValue)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="flagship">Flagship</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
