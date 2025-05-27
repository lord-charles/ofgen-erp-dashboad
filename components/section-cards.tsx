import { NetworkIcon, PackageIcon, MapPinIcon, FileTextIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      <Card className="@container/card border-none bg-gradient-to-br from-emerald-50 to-white shadow-md dark:from-emerald-950/20 dark:to-gray-900">
        <CardHeader className="relative">
          <CardDescription>Active Projects</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">24</CardTitle>
          <div className="absolute right-4 top-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <NetworkIcon className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            >
              +3 new this month
            </Badge>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card border-none bg-gradient-to-br from-blue-50 to-white shadow-md dark:from-blue-950/20 dark:to-gray-900">
        <CardHeader className="relative">
          <CardDescription>Inventory Items</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">1,458</CardTitle>
          <div className="absolute right-4 top-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <PackageIcon className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              12 items low stock
            </Badge>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card border-none bg-gradient-to-br from-amber-50 to-white shadow-md dark:from-amber-950/20 dark:to-gray-900">
        <CardHeader className="relative">
          <CardDescription>Active Locations</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">36</CardTitle>
          <div className="absolute right-4 top-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <MapPinIcon className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              5 in Nairobi County
            </Badge>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card border-none bg-gradient-to-br from-purple-50 to-white shadow-md dark:from-purple-950/20 dark:to-gray-900">
        <CardHeader className="relative">
          <CardDescription>Service Orders</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">18</CardTitle>
          <div className="absolute right-4 top-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              <FileTextIcon className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            >
              3 pending approval
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
