import Link from "next/link";
import {Mail} from "lucide-react";
import { SocialIcon } from 'react-social-icons/component'
import 'react-social-icons/github'
import 'react-social-icons/linkedin'
import {Button} from "@/components/ui/button";

export default function Footer() {
  return (
    <div className={"container mx-auto"}>
      <footer className={"w-full py-6 mb-12 shadow-xl flex flex-row items-center justify-between *:h-full"}>
        <Link href={"mailto:me@g30r93g.dev"} className={"group"}>
          <Button
            className={"inline-flex gap-2 h-full w-fit bg-secondary rounded-full"}
            variant={"outline"}
          >
            <Mail />
            <span className={"text-lg font-medium group-hover:underline"}>me@g30r93g.dev</span>
          </Button>
        </Link>
        <div className={"flex flex-row gap-2 h-full w-fit bg-secondary rounded-full p-0.5"}>
          <SocialIcon
            className={"rounded-full border border-transparent hover:border-primary"}
            network="github"
            href={"https://github.com/g30r93g"}
            bgColor={"transparent"}
            target={"_blank"}
            referrerPolicy={"no-referrer"}
          />
          <SocialIcon
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