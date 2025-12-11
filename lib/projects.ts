import { getMdx, getMdxList } from "@/lib/get-mdx";
import Project from "@/types/project";
import path from "path";
import { z } from "zod";

const projectsDirectory = path.join(process.cwd(), "/content/projects");

const projectSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  releaseDate: z.string().date().optional(),
  archived: z.boolean().optional().default(false),
  status: z.enum(["Completed", "In Progress", "Archived"]), // todo: add 'On Hold'
  icon: z.url().optional(),
  image: z.url().optional(),
  hostedUrl: z.url().optional(),
  repoUrl: z.url(),
  technologies: z.array(z.string()).optional(),
  highlight: z.boolean().optional(),
});

const projectMapper = (
  data: z.infer<typeof projectSchema>,
  content: string,
  slug: string,
): Project => ({
  title: data.title,
  description: data.description,
  slug: slug,
  icon: data.icon,
  releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
  archived: data.archived,
  status: data.status,
  hostedUrl: data.hostedUrl,
  repoUrl: data.repoUrl,
  image: data.image,
  technologies: data.technologies,
  highlight: data.highlight || false,
  content,
});

export function getAllProjects(): Project[] {
  // get list
  const list = getMdxList<Project, typeof projectSchema>(
    projectsDirectory,
    projectSchema,
    projectMapper,
  );

  // sort by release date descending, settle collisions with lexicographical order, with undefined dates first
  list.sort((a, b) => {
    if (a.releaseDate && b.releaseDate) {
      return (
        b.releaseDate.getTime() - a.releaseDate.getTime() ||
        a.title.localeCompare(b.title)
      );
    } else if (a.releaseDate) {
      return 1;
    } else if (b.releaseDate) {
      return -1;
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  return list;
}

export function getSingleProject(slug: string): Project | undefined {
  return getMdx<Project, typeof projectSchema>(
    projectsDirectory,
    projectSchema,
    projectMapper,
    slug,
  );
}
