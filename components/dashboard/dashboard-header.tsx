"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { CalendarIcon, NetworkIcon, PackageIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardHeader() {
  const [currentDate, setCurrentDate] = useState<string>("")
  const [greeting, setGreeting] = useState<string>("")

  useEffect(() => {
    // Format current date
    const now = new Date()
    setCurrentDate(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )

    // Set greeting based on time of day
    const hours = now.getHours()
    if (hours < 12) {
      setGreeting("Good morning")
    } else if (hours < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{greeting}, Admin</h1>
          <p className="text-muted-foreground">
            <CalendarIcon className="mr-1 inline-block h-4 w-4" />
            {currentDate}
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-5 md:w-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs sm:text-sm">
              <NetworkIcon className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="text-xs sm:text-sm">
              <PackageIcon className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="text-xs sm:text-sm">
              <MapPinIcon className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Locations</span>
            </TabsTrigger>
            <TabsTrigger value="contractors" className="text-xs sm:text-sm">
              <UsersIcon className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Contractors</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <MetricCard
          title="Active Projects"
          value="24"
          trend="+12%"
          trendType="positive"
          icon={<NetworkIcon className="h-4 w-4" />}
          color="emerald"
        />
        <MetricCard
          title="Low Stock Items"
          value="18"
          trend="+5"
          trendType="negative"
          icon={<PackageIcon className="h-4 w-4" />}
          color="blue"
        />
        <MetricCard
          title="Active Locations"
          value="36"
          trend="+3"
          trendType="positive"
          icon={<MapPinIcon className="h-4 w-4" />}
          color="amber"
        />
        <MetricCard
          title="Contractors"
          value="42"
          trend="0"
          trendType="neutral"
          icon={<UsersIcon className="h-4 w-4" />}
          color="purple"
        />
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  trend: string
  trendType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  color: "emerald" | "blue" | "amber" | "purple"
}

function MetricCard({ title, value, trend, trendType, icon, color }: MetricCardProps) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
  }

  const trendClasses = {
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-gray-600 dark:text-gray-400",
  }

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <span className={`text-xs font-medium ${trendClasses[trendType]}`}>{trend}</span>
            </div>
          </div>
          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${colorClasses[color]}`}>{icon}</div>
        </div>
        <div className={`h-1.5 w-full ${colorClasses[color]} opacity-80`}></div>
      </CardContent>
    </Card>
  )
}
