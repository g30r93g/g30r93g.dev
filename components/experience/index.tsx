import ExperienceList from "@/components/experience/list";
import { getExperience } from "@/lib/experience";

export default function Experience() {
  const experience = getExperience();

  return (
    <div className={"container mx-auto pt-16"}>
      <h2
        id={"experience"}
        className={"font-mono font-medium text-2xl mt-8 mb-4"}
      >
        My Experience
      </h2>
      <ExperienceList experiences={experience} initialTab={"highlighted"} />
    </div>
  );
}
