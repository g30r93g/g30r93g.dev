"use client";

import Experience from "@/types/experience";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import Link from "next/link";
import { useTheme } from "next-themes";
import { clsx } from "clsx";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ExperienceCard({
  experience,
}: {
  experience: Experience;
}) {
  const { theme } = useTheme();

  return (
    <Link href={experience.url} key={experience.slug}>
      <Card className={"p-0 h-full bg-accent/50 dark:bg-accent/35"}>
        <MagicCard
          className={"h-full"}
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          <div className={"grid grid-cols-[1fr_auto] gap-4"}>
            <CardHeader
              className={clsx("py-6", {
                "grid grid-cols-[1fr_auto] gap-4": experience.logo,
              })}
            >
              {experience.logo && (
                <span
                  className={"h-8 w-8 aspect-square rounded-full bg-gray"}
                />
              )}
              <div className={experience.logo ? "" : "flex flex-col gap-2"}>
                <CardTitle>{experience.companyName}</CardTitle>
                <CardDescription>{experience.role}</CardDescription>
              </div>
            </CardHeader>
            {experience.endDate ? (
              <Badge
                className={"bg-muted/50 mt-4 mr-4 rounded-full h-fit"}
                variant={"outline"}
              >
                {format(experience.startDate, "MM/yyyy")} –{" "}
                {format(experience.endDate, "MM/yyyy")}
              </Badge>
            ) : (
              <Badge
                className={
                  "mt-4 mr-4 rounded-full h-fit bg-green-100 dark:bg-green-950 border-green-400 dark:border-green-700"
                }
                variant={"outline"}
              >
                {format(experience.startDate, "MM/yyyy")} – Current
              </Badge>
            )}
          </div>
          <CardContent
            className={"pb-4 text-muted-foreground text-sm flex flex-col gap-2"}
          >
            {experience.tools && (
              <div className={"grid grid-cols-[auto_1fr] gap-2"}>
                <span>{experience.endDate ? "Used" : "Using"}:</span>
                <div className={"flex flex-wrap gap-2"}>
                  {experience.tools.map((tool) => (
                    <Badge
                      key={tool}
                      variant={"outline"}
                      className={"bg-muted/50 rounded-full h-fit"}
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </MagicCard>
      </Card>
    </Link>
  );
}
