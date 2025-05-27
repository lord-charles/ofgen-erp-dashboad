"use client"

import { ArrowRightIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

const serviceOrders = [
  {
    id: "SO-2024-1001",
    title: "Network Booster Installation - Nairobi CBD",
    client: "Safaricom",
    date: "Aug 15, 2024",
    status: "Pending Approval",
    priority: "High",
    type: "Installation",
  },
  {
    id: "SO-2024-1002",
    title: "Signal Amplifier Maintenance - Mombasa Port",
    client: "Safaricom",
    date: "Aug 12, 2024",
    status: "Approved",
    priority: "Medium",
    type: "Maintenance",
  },
  {
    id: "SO-2024-1003",
    title: "Fiber Optic Cable Replacement - Kisumu",
    client: "Safaricom",
    date: "Aug 10, 2024",
    status: "In Progress",
    priority: "High",
    type: "Replacement",
  },
  {
    id: "SO-2024-1004",
    title: "5G Tower Equipment Upgrade - Nakuru",
    client: "Safaricom",
    date: "Aug 8, 2024",
    status: "Completed",
    priority: "Medium",
    type: "Upgrade",
  },
  {
    id: "SO-2024-1005",
    title: "Network Diagnostics - Eldoret Branch",
    client: "Safaricom",
    date: "Aug 5, 2024",
    status: "Rejected",
    priority: "Low",
    type: "Diagnostics",
  },
]

export function RecentServiceOrders() {
  const [filter, setFilter] = useState("all")

  const filteredOrders = serviceOrders.filter((order) => {
    if (filter === "all") return true
    if (filter === "pending" && order.status === "Pending Approval") return true
    if (filter === "approved" && order.status === "Approved") return true
    if (filter === "in-progress" && order.status === "In Progress") return true
    if (filter === "completed" && order.status === "Completed") return true
    if (filter === "rejected" && order.status === "Rejected") return true
    return false
  })

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Recent Service Orders</CardTitle>
          <CardDescription>Latest service orders from Safaricom</CardDescription>
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs">
              Approved
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="text-xs">
              In Progress
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-6 pt-4">
        <div className="overflow-hidden rounded-lg border shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Service Order</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:table-cell">
                  Date
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-muted-foreground md:table-cell">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="bg-card hover:bg-muted/50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{order.title}</div>
                    <div className="text-xs text-muted-foreground">{order.client}</div>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    {order.date}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                    >
                      {order.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {order.status === "Pending Approval" && (
                      <Badge
                        variant="outline"
                        className="flex w-fit items-center gap-1 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      >
                        <ClockIcon className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                    {order.status === "Approved" && (
                      <Badge
                        variant="outline"
                        className="flex w-fit items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                      >
                        <CheckCircleIcon className="h-3 w-3" />
                        Approved
                      </Badge>
                    )}
                    {order.status === "In Progress" && (
                      <Badge
                        variant="outline"
                        className="flex w-fit items-center gap-1 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
                      >
                        <ClockIcon className="h-3 w-3" />
                        In Progress
                      </Badge>
                    )}
                    {order.status === "Completed" && (
                      <Badge
                        variant="outline"
                        className="flex w-fit items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      >
                        <CheckCircleIcon className="h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                    {order.status === "Rejected" && (
                      <Badge
                        variant="outline"
                        className="flex w-fit items-center gap-1 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      >
                        <XCircleIcon className="h-3 w-3" />
                        Rejected
                      </Badge>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="w-full gap-1">
          View All Service Orders
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
