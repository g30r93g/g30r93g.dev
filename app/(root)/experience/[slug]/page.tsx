import {getAllExperience} from "@/lib/experience";

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
  const experience = getAllExperience()

  return experience.map(({ slug }) => { return { slug } })
}

export const dynamicParams = false
