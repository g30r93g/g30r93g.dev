export default async function ExperienceItemPage({
 params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/experience/${slug}.mdx`)

  return <Post />
}

export function generateStaticParams() {
  return [
    { slug: 'outlier-ai' },
    { slug: 'kane-fm' },
    { slug: 'surrey-students-union' },
    { slug: 'university-of-surrey' },
    { slug: 'team-surrey-karting-club' },
    { slug: 'surtes' },
    { slug: 'lumen-research' },
  ]
}

export const dynamicParams = false
