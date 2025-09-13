import { getMdx, getMdxList } from "@/lib/get-mdx";
import Experience from "@/types/experience";
import path from "path";
import { z } from "zod";

const experiencesDirectory = path.join(process.cwd(), "/content/experience");

const experienceSchema = z.object({
  companyName: z.string(),
  role: z.string(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  startYear: z.number(),
  startMonth: z.number(),
  endYear: z.number().optional(),
  endMonth: z.number().optional(),
  companyUrl: z.string().url(),
  tools: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  highlight: z.boolean().optional(),
});

const experienceMapper = (data: z.infer<typeof experienceSchema>, content: string, slug: string): Experience => ({
  companyName: data.companyName,
  role: data.role,
  description: data.description,
  slug: slug,
  logo: data.logo,
  startDate: new Date(`${data.startYear}-${data.startMonth}-01`),
  endDate: (data.endYear && data.endMonth) ? new Date(`${data.endYear}-${data.endMonth}-01`) : undefined,
  url: `/experience/${slug}`,
  companyUrl: data.companyUrl,
  tools: data.tools,
  skills: data.skills,
  highlight: data.highlight || false,
  content,
});

export function getExperience(): Experience[] {
  const experience = getMdxList<Experience, typeof experienceSchema>(experiencesDirectory, experienceSchema, experienceMapper);

  // Sort by start date descending
  experience.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  return experience;
}

export function getSingleExperience(slug: string): Experience | undefined {
  return getMdx<Experience, typeof experienceSchema>(experiencesDirectory, experienceSchema, experienceMapper, slug);
}
