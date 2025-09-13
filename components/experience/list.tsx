'use client'

import ExperienceCard from '@/components/experience/card'
import type Experience from '@/types/experience'
import { useMemo, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

type TabValue = 'all' | 'highlighted'

export default function ExperienceList({
  experiences,
  initialTab = 'highlighted',
}: {
  experiences: Experience[]
  initialTab?: TabValue
}) {
  const [selectedTab, setSelectedTab] = useState<TabValue>(initialTab)

  const visible = useMemo(() => {
    if (selectedTab === 'all') return experiences
    return experiences.filter((xp) => xp.highlight)
  }, [experiences, selectedTab])

  return (
    <>
      <Tabs
        className="w-fit"
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as TabValue)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="highlighted">Highlighted</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-8 flex flex-col gap-4">
        {visible.map((xp) => (
          <ExperienceCard key={xp.slug} experience={xp} />
        ))}
      </div>
    </>
  )
}
