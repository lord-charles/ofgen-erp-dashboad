import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { InventoryDashboard } from "./inventory-dashboard";
import {
  getAllWarehouses,
  getInventoryItems,
  getSuppliers,
  getDashboardStats,
} from "@/services/inventory-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LocationsPage() {
  const [warehouses, inventoryItems, suppliers, dashboardStats] =
    await Promise.all([
      getAllWarehouses(),
      getInventoryItems(),
      getSuppliers(),
      getDashboardStats(),
    ]);
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="min-h-screen">
          <div className="p-2">
            <InventoryDashboard
              warehouses={warehouses}
              inventoryItems={inventoryItems}
              suppliers={suppliers}
              dashboardStats={dashboardStats}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
