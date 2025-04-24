"use client";

import {SocialIcon} from "react-social-icons/component";
import {useTheme} from "next-themes";
import {ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/utils";

export default function SocialNetworksPill({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  const { theme, systemTheme } = useTheme();

  const activeTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className={cn("flex flex-row gap-2 h-full w-fit bg-accent/50 dark:bg-accent/35 rounded-full border p-0.5", className)} {...props}>
      <SocialIcon
        fgColor={activeTheme === "dark" ? "white" : "black"}
        className={"rounded-full border border-transparent transition hover:bg-accent hover:border-primary"}
        network="github"
        href={"https://github.com/g30r93g"}
        bgColor={"transparent"}
        target={"_blank"}
        referrerPolicy={"no-referrer"}
      />
      <SocialIcon
        fgColor={activeTheme === "dark" ? "white" : "black"}
        className={"rounded-full border border-transparent transition hover:bg-accent hover:border-primary"}
        network="linkedin"
        href={"https://www.linkedin.com/in/g30r93g"}
        bgColor={"transparent"}
        target={"_blank"}
        referrerPolicy={"no-referrer"}
      />
    </div>
  )
}