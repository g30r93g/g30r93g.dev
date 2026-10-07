import "./legacy.css";

/**
 * The blog keeps its pre-redesign look until it gets the new design: the site's
 * dark shadcn tokens, restored inside the themed page (see legacy.css).
 */
export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={"legacy dark mt-10 mb-16"}>{children}</div>;
}
