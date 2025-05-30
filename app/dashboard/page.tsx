import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectsOverview } from "@/components/dashboard/projects-overview";
import { InventoryStatus } from "@/components/dashboard/inventory-status";
import { LocationsMap } from "@/components/dashboard/locations-map";
import { ContractorsPerformance } from "@/components/dashboard/contractors-performance";
import { RecentServiceOrders } from "@/components/dashboard/recent-service-orders";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AdvancedDashboard from "./components/advanced-dashboard";
import { getDashboardData } from "@/services/project.service";

export const metadata: Metadata = {
  title: "Dashboard | Ofgen Africa",
  description: "Overview of projects, inventory, locations, and contractors",
};
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <AdvancedDashboard dashboardData={dashboardData || {}} />
      </SidebarInset>
    </SidebarProvider>
  );
}
