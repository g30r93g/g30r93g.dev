"use client";

import Link from "next/link";
import {Mail} from "lucide-react";
import 'react-social-icons/github'
import 'react-social-icons/linkedin'
import {Button} from "@/components/ui/button";
import SocialNetworksPill from "@/components/social-networks";

export default function Footer() {
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
        <SocialNetworksPill />
      </footer>
    </div>
  )
}