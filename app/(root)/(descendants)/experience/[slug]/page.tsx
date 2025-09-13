import ExperienceContent from "@/components/experience/content"
import {
  getExperience,
  getSingleExperience,
} from "@/lib/experience"

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
  const experience = getExperience()

  return experience.map(({ slug }) => { return { slug } })
}

export const dynamicParams = false
