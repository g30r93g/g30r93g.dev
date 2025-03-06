import path from "path"
import Project from "@/types/project"
import {z} from "zod"
import {getMdx, getMdxList} from "@/lib/get-mdx"

const projectsDirectory = path.join(process.cwd(), "/content/projects")

const projectSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  releaseDate: z.string().date().optional(),
  archived: z.boolean().optional().default(false),
  icon: z.string().url().optional(),
  image: z.string().url().optional(),
})

const projectMapper = (data: z.infer<typeof projectSchema>, content: string, slug: string): Project => ({
  title: data.title,
  description: data.description,
  slug: slug,
  icon: data.icon,
  releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
  archived: data.archived,
  url: `/projects/${slug}`,
  image: data.image,
  content,
})

export function getAllProjects(): Project[] {
  return getMdxList<Project, typeof projectSchema>(projectsDirectory, projectSchema, projectMapper)
}

export function getSingleProject(slug: string): Project | undefined {
  return getMdx<Project, typeof projectSchema>(projectsDirectory, projectSchema, projectMapper, slug)
}
