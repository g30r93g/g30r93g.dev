import { getMdx, getMdxList } from "@/lib/get-mdx";
import { assetPathSchema } from "@/lib/schema";
import Experience from "@/types/experience";
import path from "path";
import { z } from "zod";

const experiencesDirectory = path.join(process.cwd(), "/content/experience");

const experienceSchema = z.object({
  companyName: z.string(),
  role: z.string(),
  description: z.string().optional(),
  logo: assetPathSchema,
  logoBackground: z.string().optional(),
  startYear: z.number(),
  startMonth: z.number(),
  endYear: z.number().optional(),
  endMonth: z.number().optional(),
  companyUrl: z.string().url(),
  tools: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  highlight: z.boolean().optional(),
  type: z.enum(["work", "education"]).optional().default("work"),
});

const experienceMapper = (
  data: z.infer<typeof experienceSchema>,
  content: string,
  slug: string,
): Experience => ({
  companyName: data.companyName,
  role: data.role,
  description: data.description,
  slug: slug,
  logo: data.logo,
  logoBackground: data.logoBackground,
  startDate: new Date(`${data.startYear}-${data.startMonth}-01`),
  endDate:
    data.endYear && data.endMonth
      ? new Date(`${data.endYear}-${data.endMonth}-01`)
      : undefined,
  url: `/experience/${slug}`,
  companyUrl: data.companyUrl,
  tools: data.tools,
  skills: data.skills,
  highlight: data.highlight || false,
  type: data.type,
  content,
});

export function getExperience(): Experience[] {
  const experience = getMdxList<Experience, typeof experienceSchema>(
    experiencesDirectory,
    experienceSchema,
    experienceMapper,
  );

  // Sort by start date descending
  experience.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  return experience;
}

export function getSingleExperience(slug: string): Experience | undefined {
  return getMdx<Experience, typeof experienceSchema>(
    experiencesDirectory,
    experienceSchema,
    experienceMapper,
    slug,
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Feb 2024" */
export const monthYear = (date: Date) => `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

/** "Feb 2024 – Nov 2024", or "Aug 2025 – Present" */
export const period = (e: Experience) =>
  `${monthYear(e.startDate)} – ${e.endDate ? monthYear(e.endDate) : "Present"}`;

/** Time in the role, counting the first and last months: Feb to Nov 2024 is "10 mos". */
export function tenure(e: Experience, now: Date) {
  const end = e.endDate ?? now;
  const months = (end.getFullYear() - e.startDate.getFullYear()) * 12 + end.getMonth() - e.startDate.getMonth() + 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years && `${years} yr${years > 1 ? "s" : ""}`, rest && `${rest} mo${rest > 1 ? "s" : ""}`]
    .filter(Boolean)
    .join(" ");
}

/** Whole years since the first work role began (the home page's "N years of"). */
export function yearsOfWork(experience: Experience[], now: Date) {
  const starts = experience.filter((e) => e.type === "work").map((e) => e.startDate.getTime());
  return Math.floor((now.getTime() - Math.min(...starts)) / (365.25 * 24 * 3600 * 1000));
}

/** "Surrey University Racing Team Engineering Solutions (SURTES)" to "SURTES" */
export const shortName = (e: Experience) => e.companyName.match(/\(([^)]+)\)$/)?.[1] ?? e.companyName;

export type TimelineBar = {
  slug: string;
  url: string;
  label: string;
  title: string;
  logo?: string;
  logoBackground?: string;
  type: Experience["type"];
  current: boolean;
  /** Start and width, as percentages of the axis. */
  left: number;
  width: number;
  lane: number;
  /** Oldest first: staggers the bars' entrance. */
  order: number;
};

export type Timeline = {
  bars: TimelineBar[];
  lanes: number;
  years: { year: number; left: number }[];
  today: number;
};

/**
 * Lays every role along one axis, from January of the first year to a few months
 * past `now` (so the current role can fade out). Roles that overlap go on separate
 * lanes; each takes the first lane that is free when it starts.
 */
export function timelineOf(experience: Experience[], now: Date): Timeline {
  const oldest = [...experience].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const from = new Date(oldest[0].startDate.getFullYear(), 0, 1).getTime();
  const to = new Date(now.getFullYear(), now.getMonth() + 4, 1).getTime();
  const at = (date: Date) => ((date.getTime() - from) / (to - from)) * 100;

  const laneEnds: number[] = [];
  const bars = oldest.map((e, order): TimelineBar => {
    const start = e.startDate.getTime();
    let lane = laneEnds.findIndex((end) => end <= start);
    if (lane === -1) lane = laneEnds.push(0) - 1;
    laneEnds[lane] = (e.endDate ?? now).getTime();
    const left = at(e.startDate);
    return {
      slug: e.slug,
      url: e.url,
      label: shortName(e),
      title: `${e.role} at ${e.companyName}, ${period(e)}`,
      logo: e.logo,
      logoBackground: e.logoBackground,
      type: e.type,
      current: !e.endDate,
      left,
      width: (e.endDate ? at(e.endDate) : 100) - left,
      lane,
      order,
    };
  });

  const years = [];
  for (let year = oldest[0].startDate.getFullYear(); year <= now.getFullYear(); year++) {
    years.push({ year, left: at(new Date(year, 0, 1)) });
  }
  return { bars, lanes: laneEnds.length, years, today: at(now) };
}
