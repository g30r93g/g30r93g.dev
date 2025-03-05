"use client";

import { useTheme } from "next-themes";
import {Card} from "./ui/card";
import { MagicCard } from "./magicui/magic-card";
import Link from "next/link";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <div className={"container mx-auto"}>
      <Card className={"p-0 mb-8"}>
        <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}>
            <Link href={"mailto:me@g30r93g.dev"}>
              <h3 className={"text-xl font-bold font-mono px-4 py-6 hover:underline"}>me@g30r93g.dev</h3>
            </Link>
        </MagicCard>
      </Card>
    </div>
  )
}