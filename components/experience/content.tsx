import Experience from "@/types/experience";
import { MDXRemote } from "next-mdx-remote/rsc";

export default function ExperienceContent({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <div className={"container mx-auto"}>
      <div className={"flex flex-row items-center gap-4"}>
        <span className={"w-8 h-8 rounded-full bg-secondary"} />
        <div>
          <h1 className={"font-medium text-2xl"}>{experience.companyName}</h1>
          <h2 className={"text-muted-foreground"}>{experience.role}</h2>
        </div>
      </div>

      <div className={"mt-6 prose prose-neutral dark:prose-invert max-w-none"}>
        <MDXRemote source={experience.content} />
      </div>
    </div>
  );
}
