import {
  getAllExperience,
  getSingleExperience,
} from "@/lib/experience"
import ExperienceContent from "@/components/experience/content"

export default async function ExperienceItemPage({
 params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const experience = getSingleExperience(slug)

  if (!experience) {
    return <div>Experience not found</div>
  }

  return <ExperienceContent experience={experience} />
}

export function generateStaticParams() {
  const experience = getAllExperience()

  return experience.map(({ slug }) => { return { slug } })
}

export const dynamicParams = false
