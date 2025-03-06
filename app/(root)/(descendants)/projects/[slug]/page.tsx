import {
    getAllProjects,
    getSingleProject
} from "@/lib/projects"
import ProjectContent from "@/components/projects/content"

export default async function ProjectItemPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const project = getSingleProject(slug)

    if (!project) {
        return <div>Project not found</div>
    }

    return <ProjectContent project={project} />
}

export function generateStaticParams() {
    const projects = getAllProjects()

    return projects.map(({ slug }) => { return { slug } })
}

export const dynamicParams = false
