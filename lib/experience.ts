import path from "path";
import Experience from "@/types/experience";
import {z} from "zod";
import {getMdx} from "@/lib/get-mdx";

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
});

const projectMapper = (data: z.infer<typeof experienceSchema>, content: string, slug: string): Experience => ({
  companyName: data.companyName,
  role: data.role,
  description: data.description,
  slug: slug,
  logo: data.logo,
  startDate: new Date(`${data.startYear}-${data.startMonth}-01`),
  endDate: (data.endYear && data.endMonth) ? new Date(`${data.endYear}-${data.endMonth}-01`) : undefined,
  url: `/experience/${slug}`,
  companyUrl: data.companyUrl,
  content,
});

export function getAllExperience(): Experience[] {
  return getMdx<Experience, typeof experienceSchema>(experiencesDirectory, experienceSchema, projectMapper);
}
