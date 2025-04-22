"use client";

import Link from "next/link";
import {Mail} from "lucide-react";
import { SocialIcon } from 'react-social-icons/component'
import 'react-social-icons/github'
import 'react-social-icons/linkedin'
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";

export default function Footer() {
  const { theme, systemTheme } = useTheme();

  const activeTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className={"container mx-auto"}>
      <footer className={"w-full py-6 mb-12 flex flex-row items-center justify-between *:h-full"}>
        <Link href={"mailto:me@g30r93g.dev"} className={"group"}>
          <Button
            className={"inline-flex gap-2 h-full w-fit bg-accent/50 dark:bg-accent/35 rounded-full"}
            variant={"outline"}
          >
            <Mail />
            <span className={"text-lg font-medium group-hover:underline"}>me@g30r93g.dev</span>
          </Button>
        </Link>
        <div className={"flex flex-row gap-2 h-full w-fit bg-accent/50 dark:bg-accent/35 rounded-full border p-0.5"}>
          <SocialIcon
            fgColor={activeTheme === "dark" ? "white" : "black"}
            className={"rounded-full border border-transparent hover:border-primary"}
            network="github"
            href={"https://github.com/g30r93g"}
            bgColor={"transparent"}
            target={"_blank"}
            referrerPolicy={"no-referrer"}
          />
          <SocialIcon
            fgColor={activeTheme === "dark" ? "white" : "black"}
            className={"rounded-full border border-transparent hover:border-primary"}
            network="linkedin"
            href={"https://www.linkedin.com/in/g30r93g"}
            bgColor={"transparent"}
            target={"_blank"}
            referrerPolicy={"no-referrer"}
          />
        </div>
      </footer>
    </div>
  )
}