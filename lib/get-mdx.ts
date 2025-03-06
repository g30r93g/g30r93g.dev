import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

export function getMdxList<T, S extends z.ZodObject<z.ZodRawShape>>(
  dir: string,
  schema: S,
  typeMap: (data: z.infer<S>, content: string, slug: string) => T
): T[] {
  try {
    console.debug("Reading directory:", dir);

    const files = fs.readdirSync(dir);

    console.debug("Files detected:", files);

    const mappedFiles = files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => {
        const filePath = path.join(dir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);
        const slug = file.replace(".mdx", "");

        // Validate frontmatter using Zod
        const parsed = schema.safeParse(data);
        if (!parsed.success) {
          console.warn(`Skipping ${file}: Invalid frontmatter`, parsed.error.format());
          return undefined;
        }

        // Transform to the target type using `typeMap`
        return typeMap(parsed.data, content, slug);
      })
      .filter((item): item is T => item !== undefined); // Type guard to remove undefined

    console.debug(`${files.length} files detected, ${mappedFiles.length} valid files processed.`);

    return mappedFiles;
  } catch (error) {
    console.error("Error processing MDX files:", error);
    return [];
  }
}

export function getMdx<T, S extends z.ZodObject<z.ZodRawShape>>(
  dir: string,
  schema: S,
  typeMap: (data: z.infer<S>, content: string, slug: string) => T,
  slug: string // Added slug parameter to search for a specific project
): T | undefined {
  try {
    console.debug("Reading directory:", dir);

    const files = fs.readdirSync(dir);

    console.debug("Files detected:", files);

    // Search for the file with the matching slug
    const file = files.find((file) => file.replace(".mdx", "") === slug);

    if (!file) {
      console.warn(`No file found for slug: ${slug}`);
      return undefined;
    }

    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Validate frontmatter using Zod
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      console.warn(`Invalid frontmatter in file: ${file}`, parsed.error.format());
      return undefined;
    }

    // Transform to the target type using `typeMap`
    return typeMap(parsed.data, content, slug);
  } catch (error) {
    console.error("Error processing MDX files:", error);
    return undefined;
  }
}
