import { getBlogPosts } from "@/lib/blog";
import { getExperience, period } from "@/lib/experience";
import { getAllProjects } from "@/lib/projects";
import type Experience from "@/types/experience";
import type Project from "@/types/project";

// built once from content/, like the sitemap
export const dynamic = "force-static";

const SITE = "https://g30r93g.dev";
const NAME = "George Nick Gorzynski";

/** Joins the parts that exist into sentences, without doubling a description's own full stop. */
const sentences = (...parts: (string | false | undefined)[]) =>
  parts
    .filter(Boolean)
    .map((part) => (part as string).replace(/\.$/, ""))
    .join(". ");

/** "- [Title](url): notes", the link format llms.txt uses */
const link = (title: string, url: string, notes?: string) =>
  `- [${title}](${url})${notes ? `: ${notes}` : ""}`;

const role = (e: Experience) =>
  link(
    `${e.role} at ${e.companyName}`,
    `${SITE}${e.url}`,
    sentences(
      e.description,
      period(e),
      !!e.tools?.length && `Tools: ${e.tools.join(", ")}`,
    ),
  );

const project = (p: Project) =>
  link(
    p.title,
    p.hostedUrl ?? p.repoUrl ?? SITE,
    sentences(
      p.description,
      p.status,
      !!p.technologies?.length && `Built with ${p.technologies.join(", ")}`,
    ),
  );

/** /llms.txt (llmstxt.org): who George is and where to read more, for language models. */
export function GET() {
  const experience = getExperience();
  const posts = getBlogPosts().filter((post) => !post.draft);
  const projects = getAllProjects();
  const current = experience.find((e) => e.type === "work" && !e.endDate);

  const sections: [string, string[]][] = [
    [
      "Pages",
      [
        link("Home", SITE, "Overview, current role, projects and tools"),
        link("Experience", `${SITE}/experience`, "Every role on one timeline"),
      ],
    ],
    ["Experience", experience.filter((e) => e.type === "work").map(role)],
    ["Education", experience.filter((e) => e.type === "education").map(role)],
    ["Projects", projects.filter((p) => !p.archived).map(project)],
    [
      "Writing",
      posts.map((post) =>
        link(
          post.title,
          `${SITE}${post.url}`,
          post.description ??
            `Published ${post.publishedDate.toISOString().slice(0, 10)}`,
        ),
      ),
    ],
    [
      "Profiles",
      [
        link("GitHub", "https://github.com/g30r93g"),
        link("LinkedIn", "https://www.linkedin.com/in/g30r93g"),
      ],
    ],
    ["Optional", projects.filter((p) => p.archived).map(project)],
  ];

  const body = [
    `# ${NAME}`,
    `> ${NAME} (g30r93g) is a full-stack software engineer in London, building web, desktop and iOS products with TypeScript, React, Next.js, Swift and AWS.`,
    current &&
      `George currently works as ${current.role} at ${current.companyName}.`,
    ...sections
      .filter(([, lines]) => lines.length)
      .map(([title, lines]) => `## ${title}\n\n${lines.join("\n")}`),
  ]
    .filter(Boolean)
    .join("\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
