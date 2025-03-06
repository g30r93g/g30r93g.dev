"use client"

import Experience from "@/types/experience";
import {MDXProvider} from "@mdx-js/react";

export default function ExperienceContent({ experience }: { experience: Experience }) {
  return (
    <div className={"container mx-auto"}>
      <div className={"flex flex-row items-center gap-4"}>
        <span className={"w-8 h-8 rounded-full bg-secondary"} />
        <div>
          <h1>{experience.companyName}</h1>
          <h2>{experience.role}</h2>
        </div>
      </div>

      <MDXProvider>
        <div>{experience.content}</div>
      </MDXProvider>
    </div>
  );
}