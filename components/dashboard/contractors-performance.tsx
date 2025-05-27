"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { ArrowRightIcon, StarIcon, UsersIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const contractorData = [
  {
    id: "CON-001",
    name: "TechBuild Kenya",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "TK",
    completedProjects: 12,
    rating: 4.8,
    specialty: "Network Infrastructure",
  },
  {
    id: "CON-002",
    name: "ElectroSystems Ltd",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ES",
    completedProjects: 9,
    rating: 4.5,
    specialty: "Signal Boosters",
  },
  {
    id: "CON-003",
    name: "FiberTech Solutions",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "FS",
    completedProjects: 15,
    rating: 4.9,
    specialty: "Fiber Optic Installation",
  },
]

const performanceData = [
  { name: "TechBuild", onTime: 92, quality: 88, budget: 95 },
  { name: "ElectroSys", onTime: 85, quality: 90, budget: 82 },
  { name: "FiberTech", onTime: 97, quality: 94, budget: 90 },
]

export function ContractorsPerformance() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Contractors Performance</CardTitle>
        <CardDescription>Top performing contractors and their metrics</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pt-4">
        <div className="h-[180px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              barSize={12}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, ""]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              />
              <Bar dataKey="onTime" name="On Time" fill="#10b981" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="onTime"
                  position="top"
                  formatter={(value) => `${value}%`}
                  style={{ fontSize: 10 }}
                />
              </Bar>
              <Bar dataKey="quality" name="Quality" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="quality"
                  position="top"
                  formatter={(value) => `${value}%`}
                  style={{ fontSize: 10 }}
                />
              </Bar>
              <Bar dataKey="budget" name="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="budget"
                  position="top"
                  formatter={(value) => `${value}%`}
                  style={{ fontSize: 10 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm font-medium">
            <UsersIcon className="h-4 w-4 text-purple-500" />
            Top Contractors
          </h3>

          {contractorData.map((contractor) => (
            <div
              key={contractor.id}
              className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={contractor.avatar || "/placeholder.svg"} alt={contractor.name} />
                  <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                    {contractor.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{contractor.name}</div>
                  <div className="text-xs text-muted-foreground">{contractor.specialty}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-medium">{contractor.rating}</span>
                </div>
                <div className="text-xs text-muted-foreground">{contractor.completedProjects} projects</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="w-full gap-1">
          View All Contractors
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
