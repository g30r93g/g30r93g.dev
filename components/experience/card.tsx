"use client"

import Experience from "@/types/experience";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {MagicCard} from "@/components/magicui/magic-card";
import Link from "next/link";
import {useTheme} from "next-themes";
import {clsx} from "clsx";

export default function ExperienceCard({ experience }: { experience: Experience } ) {
  const { theme } = useTheme();

  return (
    <Link href={experience.url} key={experience.slug}>
      <Card className={"p-0 h-full bg-accent/50 dark:bg-accent/35"}>
        <MagicCard className={"h-full"} gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}>
          <CardHeader className={clsx("py-6", {
            'grid grid-cols-[1fr_auto] gap-4': experience.logo
          })}>
            {experience.logo && (
              <span className={"h-8 w-8 aspect-square rounded-full bg-gray"} />
            )}
            <div className={experience.logo ? "" : "flex flex-col gap-2"}>
              <CardTitle>{experience.companyName}</CardTitle>
              <CardDescription>{experience.role}</CardDescription>
            </div>
          </CardHeader>
        </MagicCard>
      </Card>
    </Link>
  )
}