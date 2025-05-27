"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ArrowRightIcon, AlertTriangleIcon, PackageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const inventoryData = [
  { name: "In Stock", value: 1245, color: "#10b981" },
  { name: "Low Stock", value: 18, color: "#f59e0b" },
  { name: "Out of Stock", value: 7, color: "#ef4444" },
]

const lowStockItems = [
  {
    id: "INV-1023",
    name: "Network Booster Type A",
    quantity: 5,
    threshold: 10,
    category: "Boosters",
  },
  {
    id: "INV-1045",
    name: "Signal Amplifier 5G",
    quantity: 3,
    threshold: 8,
    category: "Amplifiers",
  },
  {
    id: "INV-1078",
    name: "Fiber Optic Cable (100m)",
    quantity: 2,
    threshold: 5,
    category: "Cables",
  },
]

export function InventoryStatus() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Overview of electronic equipment stock levels</CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <div className="h-[180px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} items`, "Quantity"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm font-medium">
              <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
              Low Stock Alerts
            </h3>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
              {lowStockItems.length} items
            </Badge>
          </div>

          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                    <PackageIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.category} • {item.id}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-amber-600 dark:text-amber-400">
                    {item.quantity} <span className="text-xs">/ {item.threshold}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Reorder soon</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="w-full gap-1">
          View Inventory
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
