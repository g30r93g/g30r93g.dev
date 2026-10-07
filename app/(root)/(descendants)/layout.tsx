import Footer from "@/components/footer";
import Header from "@/components/header";

export default function DescendantsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"mx-4 md:mx-auto"}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
