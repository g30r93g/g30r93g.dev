// the pages are static: the year is when they were built
const YEAR = new Date().getFullYear();

/** Pages below the home page: the page, then a footer that stays put while pages slide. */
export default function DescendantsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <footer className={"site-foot"}>
        <span className={"label"}>© {YEAR} George Nick Gorzynski</span>
        <a className={"label"} href={"mailto:me@g30r93g.dev"}>
          me@g30r93g.dev
        </a>
      </footer>
    </>
  );
}
