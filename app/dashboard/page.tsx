import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"
import { InventoryStatus } from "@/components/dashboard/inventory-status"
import { LocationsMap } from "@/components/dashboard/locations-map"
import { ContractorsPerformance } from "@/components/dashboard/contractors-performance"
import { RecentServiceOrders } from "@/components/dashboard/recent-service-orders"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Dashboard | Ofgen Africa",
  description: "Overview of projects, inventory, locations, and contractors",
}

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset >
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-6 p-6">
            <DashboardHeader />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <ProjectsOverview className="xl:col-span-2" />
              <InventoryStatus />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <LocationsMap />
              <ContractorsPerformance />
            </div>

            <RecentServiceOrders />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
