"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ArrowRightIcon, CheckCircleIcon, ClockIcon, FilterIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const projectData = [
  { name: "Network Boosters", completed: 18, inProgress: 7, planned: 5 },
  { name: "Signal Amplifiers", completed: 12, inProgress: 5, planned: 3 },
  { name: "Fiber Optic", completed: 24, inProgress: 3, planned: 2 },
  { name: "Cell Towers", completed: 8, inProgress: 4, planned: 6 },
  { name: "Data Centers", completed: 5, inProgress: 2, planned: 4 },
  { name: "Wireless Mesh", completed: 15, inProgress: 6, planned: 3 },
]

const recentProjects = [
  {
    id: "PRJ-2024-001",
    name: "Nairobi CBD Network Expansion",
    client: "Safaricom",
    progress: 75,
    status: "In Progress",
    dueDate: "Aug 15, 2024",
  },
  {
    id: "PRJ-2024-002",
    name: "Mombasa Port Signal Boosters",
    client: "Safaricom",
    progress: 100,
    status: "Completed",
    dueDate: "Jul 30, 2024",
  },
  {
    id: "PRJ-2024-003",
    name: "Kisumu 5G Infrastructure",
    client: "Safaricom",
    progress: 45,
    status: "In Progress",
    dueDate: "Sep 22, 2024",
  },
]

interface ProjectsOverviewProps {
  className?: string
}

export function ProjectsOverview({ className }: ProjectsOverviewProps) {
  const [timeRange, setTimeRange] = useState("quarter")
  const [chartView, setChartView] = useState("bar")

  return (
    <Card className={`border-none shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Projects Overview</CardTitle>
          <CardDescription>Status of all electronic infrastructure projects</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={chartView} onValueChange={setChartView} className="hidden sm:block">
            <TabsList className="h-8">
              <TabsTrigger value="bar" className="text-xs">
                Bar
              </TabsTrigger>
              <TabsTrigger value="stack" className="text-xs">
                Stack
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={projectData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={8}
              barSize={chartView === "bar" ? 16 : 32}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.split(" ")[0]}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              />
              {chartView === "bar" ? (
                <>
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="inProgress" fill="#f59e0b" radius={[4, 4, 0, 0]} name="In Progress" />
                  <Bar dataKey="planned" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Planned" />
                </>
              ) : (
                <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed">
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#10b981" />
                  ))}
                </Bar>
              )}
              {chartView === "stack" && (
                <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="In Progress">
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#f59e0b" />
                  ))}
                </Bar>
              )}
              {chartView === "stack" && (
                <Bar dataKey="planned" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} name="Planned">
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#8b5cf6" />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Recent Projects</h3>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
              <FilterIcon className="h-3 w-3" />
              Filter
            </Button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{project.name}</span>
                      {project.status === "Completed" ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                        >
                          <CheckCircleIcon className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                        >
                          <ClockIcon className="mr-1 h-3 w-3" />
                          In Progress
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium">{project.client}</span> • {project.id}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Progress value={project.progress} className="h-2" />
                  <span className="text-xs font-medium">{project.progress}%</span>
                </div>

                <div className="text-xs text-muted-foreground">Due: {project.dueDate}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="w-full gap-1">
          View All Projects
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
