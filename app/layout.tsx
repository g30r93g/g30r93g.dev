import type { Metadata } from "next";
import { Rethink_Sans, Roboto_Mono } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/footer";
// import { CircleAlert } from "lucide-react";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const rethinkSans = Rethink_Sans({
  variable: "--font-rethink-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "g30r93g",
  description: "Personal website of George Nick Gorzynski",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${robotoMono.variable} ${rethinkSans.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/*{ isDev && (*/}
          {/*    <div className={"absolute w-full h-4 bg-orange-700 flex flex-row items-center justify-center z-[100] text-xs"}>*/}
          {/*        <CircleAlert className={"h-3"} />*/}
          {/*        <p>Development Build</p>*/}
          {/*    </div>*/}
          {/*)}*/}
          <div className={"mx-4 md:mx-auto"}>
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
