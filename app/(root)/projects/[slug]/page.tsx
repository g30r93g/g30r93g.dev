import {getAllProjects} from "@/lib/projects";

export default async function ProjectItemPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const { default: Post } = await import(`@/content/projects/${slug}.mdx`)

    return <Post />
}

export function generateStaticParams() {
    const projects = getAllProjects()

    return projects.map(({ slug }) => { return { slug } })
}

export const dynamicParams = false
