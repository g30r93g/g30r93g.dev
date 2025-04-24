import {getAllExperience} from "@/lib/experience";
import ExperienceCard from "@/components/experience/card";

export default function Experience() {
  const experience = getAllExperience();

  return (
    <div className={"container mx-auto pt-16"}>
      <h2 id={"experience"} className={"font-mono font-medium text-2xl mt-8"}>My Experience</h2>
      <div className={"mt-8 flex flex-col gap-4"}>
        {experience.map((xp) => <ExperienceCard key={xp.slug} experience={xp} />)}
      </div>
    </div>
  )
}