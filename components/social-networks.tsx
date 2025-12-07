"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons/component";

export default function SocialNetworksPill({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme === "system" ? systemTheme : theme;
  const fgColor = activeTheme === "dark" ? "white" : "black";

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-row gap-2 h-full w-fit bg-accent/50 dark:bg-accent/35 rounded-full border p-0.5",
        className,
      )}
      {...props}
    >
      <SocialIcon
        fgColor={fgColor}
        className={
          "rounded-full border border-transparent transition hover:bg-accent hover:border-primary"
        }
        network="github"
        href={"https://github.com/g30r93g"}
        bgColor={"transparent"}
        target={"_blank"}
        referrerPolicy={"no-referrer"}
      />
      <SocialIcon
        fgColor={fgColor}
        className={
          "rounded-full border border-transparent transition hover:bg-accent hover:border-primary"
        }
        network="linkedin"
        href={"https://www.linkedin.com/in/g30r93g"}
        bgColor={"transparent"}
        target={"_blank"}
        referrerPolicy={"no-referrer"}
      />
    </div>
  );
}
