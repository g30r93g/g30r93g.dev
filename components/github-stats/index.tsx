"use client";

import useGithubStats from "react-github-user-stats";
import {Loader} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import GitHubCalendar from "react-github-calendar";
import { format } from "date-fns";
import Image from 'next/image'

export default function GithubStats() {
  const { error, loading, userData } = useGithubStats("g30r93g");

  return (
    <div className={"container mx-auto py-16"}>
      <h2 className={"font-mono font-medium text-2xl my-8"}>GitHub Stats</h2>
      { (loading || error) && (
        <div className={"flex items-center justify-center"}>
          {loading && <Loader className={"animate-spin"} />}
          {error && <span>Error fetching user data from GitHub.</span>}
        </div>
      )}
      { userData && (
        <div className={"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_3fr] gap-4"}>
          <Card className={"h-full w-full"}>
            <CardHeader className={"flex flex-row gap-4"}>
              <Image
                className={"rounded-full aspect-square"}
                src={userData.avatar_url ?? ""}
                alt={`GitHub avatar for ${userData.username}`}
                width={75}
                height={75}
              />
              <div className={"flex flex-col gap-2"}>
                <CardTitle className={"text-2xl font-mono"}>{userData.username}</CardTitle>
                <CardDescription>User since {format(userData.created_at, 'd/M/yyyy')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className={"grid grid-cols-3 grid-rows-1 justify-between items-center"}>
              <div className={"flex flex-col gap-2 items-center"}>
                <span className={"text-4xl font-bold"}>{userData.public_repos}</span>
                <span>Repositories</span>
              </div>
              <div className={"flex flex-col gap-2 items-center"}>
                <span className={"text-4xl font-bold"}>{userData.total_stars}</span>
                <span>Stars</span>
              </div>
              <div className={"flex flex-col gap-2 items-center"}>
                <span className={"text-4xl font-bold"}>{userData.public_gists}</span>
                <span>Gists</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <GitHubCalendar username="g30r93g" />
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  )
}