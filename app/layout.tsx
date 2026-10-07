import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://g30r93g.dev"),
  title: {
    default: "George Nick Gorzynski | Full-Stack Software Engineer in London",
    template: "%s | George Nick Gorzynski",
  },
  description:
    "George Nick Gorzynski is a full-stack software engineer in London, building web, desktop and iOS products with TypeScript, React, Next.js, Swift and AWS.",
  authors: [{ name: "George Nick Gorzynski", url: "https://g30r93g.dev" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={fontVariables} suppressHydrationWarning>
      <body className={"antialiased"}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
