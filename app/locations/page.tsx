import { Suspense } from "react"
import { getLocations } from "@/services/location-service"
import { LocationStats } from "@/app/locations/components/location-stats"
import { LocationActions } from "@/app/locations/components/location-actions"
import { Card } from "@/components/ui/card"
import { Location } from "@/types/location"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import LocationsTable from "./components/locations-table/locations"

function calculateStats(locations: Location[]) {
  const counties = new Set(locations.map((loc) => loc.county)).size
  const statusCounts = locations.reduce(
    (acc, loc) => {
      acc[loc.status] = (acc[loc.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const typeCounts = locations.reduce(
    (acc, loc) => {
      acc[loc.siteType] = (acc[loc.siteType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    total: locations.length,
    active: statusCounts.active || 0,
    inactive: statusCounts.inactive || 0,
    maintenance: statusCounts.maintenance || 0,
    counties,
    outdoorSites: typeCounts.outdoor || 0,
    indoorSites: (typeCounts.indoor || 0) + (typeCounts.rooftop || 0) + (typeCounts.ground || 0),
  }
}

async function LocationsContent() {
  const locations = await getLocations()
  const stats = calculateStats(locations)
  console.log(locations)

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <LocationStats stats={{ ...stats, locations }} />
      <Card className="border-0 shadow-xl ">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Locations
            </h2>
            <p className="text-muted-foreground text-md">Manage and monitor all your site locations</p>
          </div>
          <LocationActions />
        </div>
        <LocationsTable data={locations} />
      </Card>
    </div>
  )
}

export default function LocationsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset >
        <SiteHeader />
        <div className="min-h-screen">
          <div className="p-2">
            <LocationsContent />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
