import "./theme.css";
import SiteNav from "@/components/site/nav";
import StorageNotice from "@/components/site/storage-notice";
import { SiteProvider } from "@/components/site/theme-provider";
import { THEME_BOOT_SCRIPT } from "@/components/home/themes";
import { getBlogPosts } from "@/lib/blog";
import { getExperience } from "@/lib/experience";

/**
 * Every page wears the theme. This layout persists across navigations, so the
 * nav stays mounted and animates between pages instead of being replaced.
 */
export default function ThemedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // each path's crumb in the nav
  const titles: Record<string, string> = {
    "/experience": "Experience",
    "/blog": "Blog",
    ...Object.fromEntries(getExperience().map((e) => [e.url, e.role])),
    ...Object.fromEntries(getBlogPosts().map((post) => [post.url, post.title])),
  };

  return (
    <SiteProvider>
      {/* wear the saved theme before first paint */}
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      <div className={"aura"} aria-hidden={"true"} />
      <SiteNav titles={titles} />
      {children}
      <StorageNotice />
    </SiteProvider>
  );
}
