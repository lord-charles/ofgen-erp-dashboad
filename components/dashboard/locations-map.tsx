"use client"

import { useState } from "react"
import { ArrowRightIcon, MapPinIcon, NetworkIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const locationData = [
  {
    id: "LOC-001",
    name: "Nairobi CBD Tower",
    address: "Kenyatta Avenue, Nairobi",
    projects: 5,
    status: "Active",
    type: "Urban",
  },
  {
    id: "LOC-002",
    name: "Mombasa Port Facility",
    address: "Port Area, Mombasa",
    projects: 3,
    status: "Active",
    type: "Coastal",
  },
  {
    id: "LOC-003",
    name: "Kisumu Lakeside Station",
    address: "Lake Victoria Shore, Kisumu",
    projects: 2,
    status: "Active",
    type: "Rural",
  },
  {
    id: "LOC-004",
    name: "Nakuru Town Center",
    address: "Central District, Nakuru",
    projects: 4,
    status: "Active",
    type: "Urban",
  },
]

export function LocationsMap() {
  const [locationType, setLocationType] = useState("all")

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Locations</CardTitle>
          <CardDescription>Project sites across Kenya</CardDescription>
        </div>
        <Tabs value={locationType} onValueChange={setLocationType} className="hidden sm:block">
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="urban" className="text-xs">
              Urban
            </TabsTrigger>
            <TabsTrigger value="rural" className="text-xs">
              Rural
            </TabsTrigger>
            <TabsTrigger value="coastal" className="text-xs">
              Coastal
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-6 pt-4">
        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800">
          {/* This would be replaced with an actual map component in production */}
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPinIcon className="mx-auto h-8 w-8 text-emerald-600" />
              <p className="mt-2 text-sm font-medium">Interactive Map</p>
              <p className="text-xs">Showing {locationData.length} active locations</p>
            </div>
          </div>

          {/* Map markers would be positioned absolutely here */}
          <div className="absolute left-[20%] top-[30%] h-4 w-4 animate-pulse rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
          <div className="absolute left-[70%] top-[60%] h-4 w-4 animate-pulse rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
          <div className="absolute left-[40%] top-[70%] h-4 w-4 animate-pulse rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
          <div className="absolute left-[55%] top-[40%] h-4 w-4 animate-pulse rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
        </div>

        <div className="space-y-3">
          {locationData
            .filter((loc) => locationType === "all" || loc.type.toLowerCase() === locationType)
            .map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-muted-foreground">{location.address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                  >
                    <NetworkIcon className="h-3 w-3" />
                    {location.projects}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="w-full gap-1">
          View All Locations
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
