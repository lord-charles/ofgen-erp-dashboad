"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = [
  { date: "2024-04-01", completed: 12, inProgress: 8, planned: 5 },
  { date: "2024-04-15", completed: 19, inProgress: 10, planned: 7 },
  { date: "2024-05-01", completed: 22, inProgress: 12, planned: 9 },
  { date: "2024-05-15", completed: 28, inProgress: 14, planned: 11 },
  { date: "2024-06-01", completed: 35, inProgress: 15, planned: 12 },
  { date: "2024-06-15", completed: 41, inProgress: 13, planned: 14 },
  { date: "2024-07-01", completed: 48, inProgress: 11, planned: 16 },
  { date: "2024-07-15", completed: 52, inProgress: 9, planned: 18 },
  { date: "2024-08-01", completed: 58, inProgress: 7, planned: 15 },
  { date: "2024-08-15", completed: 65, inProgress: 5, planned: 12 },
  { date: "2024-09-01", completed: 72, inProgress: 8, planned: 10 },
  { date: "2024-09-15", completed: 78, inProgress: 10, planned: 8 },
]

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(142, 76%, 36%)", // emerald-600
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(31, 90%, 50%)", // amber-500
  },
  planned: {
    label: "Planned",
    color: "hsl(262, 83%, 58%)", // purple-600
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("6m")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("3m")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-09-15")
    let monthsToSubtract = 12
    if (timeRange === "6m") {
      monthsToSubtract = 6
    } else if (timeRange === "3m") {
      monthsToSubtract = 3
    }
    const startDate = new Date(referenceDate)
    startDate.setMonth(startDate.getMonth() - monthsToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card border-none shadow-md">
      <CardHeader className="relative">
        <CardTitle>Project Status Overview</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Tracking project completion rates over time</span>
          <span className="@[540px]/card:hidden">Project completion rates</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="12m" className="h-8 px-2.5">
              Last 12 months
            </ToggleGroupItem>
            <ToggleGroupItem value="6m" className="h-8 px-2.5">
              Last 6 months
            </ToggleGroupItem>
            <ToggleGroupItem value="3m" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40" aria-label="Select a time range">
              <SelectValue placeholder="Last 6 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="12m" className="rounded-lg">
                Last 12 months
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="3m" className="rounded-lg">
                Last 3 months
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(31, 90%, 50%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(31, 90%, 50%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <Tooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="planned"
                stackId="1"
                stroke="hsl(262, 83%, 58%)"
                fillOpacity={1}
                fill="url(#colorPlanned)"
              />
              <Area
                type="monotone"
                dataKey="inProgress"
                stackId="1"
                stroke="hsl(31, 90%, 50%)"
                fillOpacity={1}
                fill="url(#colorInProgress)"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="hsl(142, 76%, 36%)"
                fillOpacity={1}
                fill="url(#colorCompleted)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
