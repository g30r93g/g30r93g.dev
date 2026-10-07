import registry from "@/content/tools.json";
import { THEME_IDS, THEMES, type ThemeId } from "@/components/home/themes";
import { getSingleProject } from "@/lib/projects";

export type Tool = { name: string; icon: string };
export type ToolStacks = {
  tools: Record<string, Tool>;
  stacks: Record<ThemeId, string[]>;
};

const order = Object.keys(registry.tools);

/** Technology name (or alias), lower-cased, to tool id. */
const lookup = new Map(
  Object.entries(registry.tools).flatMap(([id, tool]) =>
    [tool.name, ...("aliases" in tool ? tool.aliases : [])].map(
      (name) => [name.toLowerCase(), id] as const,
    ),
  ),
);

/**
 * The tooling strip for each theme. Project stacks come from `technologies` in
 * that project's content file; technologies without a logo in content/tools.json
 * are left out. Logos are in public/tools (scripts/fetch-tool-logos.py).
 */
export function getToolStacks(): ToolStacks {
  const stacks = Object.fromEntries(
    THEME_IDS.map((theme) => {
      const slug = THEMES[theme].project;
      const ids = slug
        ? (getSingleProject(slug)?.technologies ?? []).flatMap((t) => lookup.get(t.toLowerCase()) ?? [])
        : registry.personal;
      return [theme, [...new Set(ids)].sort((a, b) => order.indexOf(a) - order.indexOf(b))];
    }),
  ) as Record<ThemeId, string[]>;

  const used = new Set(Object.values(stacks).flat());
  const tools = Object.fromEntries(
    [...used].map((id) => [
      id,
      { name: registry.tools[id as keyof typeof registry.tools].name, icon: `/tools/${id}.svg` },
    ]),
  );
  return { tools, stacks };
}

/** A technology's logo in public/tools, or undefined when content/tools.json has none. */
export function toolIcon(name: string): string | undefined {
  const id = lookup.get(name.toLowerCase());
  return id && `/tools/${id}.svg`;
}
