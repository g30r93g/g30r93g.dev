import "@/app/globals.css";
import Header from "@/components/header";

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  // const isDev = process.env.NODE_ENV === 'development';

  return (
    <>
      <Header />
      {children}
    </>
  );
}
