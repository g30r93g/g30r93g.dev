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
    return [
        { slug: 'tfl-planner' },
        { slug: 'woodhouse-hub' },
        { slug: 'team-surrey-karting-club' },
        { slug: 'tableside' },
        { slug: 'opensu' },
    ]
}

export const dynamicParams = false
