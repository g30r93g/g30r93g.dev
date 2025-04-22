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
  status: z.enum(['Completed', 'In Progress', 'Archived']), // todo: add 'On Hold'
  icon: z.string().url().optional(),
  image: z.string().url().optional(),
  url: z.string().url(),
  technologies: z.array(z.string()).optional(),
})

const projectMapper = (data: z.infer<typeof projectSchema>, content: string, slug: string): Project => ({
  title: data.title,
  description: data.description,
  slug: slug,
  icon: data.icon,
  releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
  archived: data.archived,
  status: data.status,
  url: data.url,
  image: data.image,
  technologies: data.technologies,
  content,
})

export function getAllProjects(): Project[] {
  // get list
  const list = getMdxList<Project, typeof projectSchema>(projectsDirectory, projectSchema, projectMapper)

  // sort by release date descending, settle collisions with lexicographical order, with undefined dates first
  list.sort((a, b) => {
    if (a.releaseDate && b.releaseDate) {
      return b.releaseDate.getTime() - a.releaseDate.getTime() || a.title.localeCompare(b.title)
    } else if (a.releaseDate) {
      return 1
    } else if (b.releaseDate) {
      return -1
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  return list;
}

export function getSingleProject(slug: string): Project | undefined {
  return getMdx<Project, typeof projectSchema>(projectsDirectory, projectSchema, projectMapper, slug)
}
