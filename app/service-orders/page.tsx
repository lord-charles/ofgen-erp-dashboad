
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import ServiceOrderDashboard from "./service-order-dashboard"
import { getServiceOrders } from "@/services/service-order-service"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"

export const dynamic = "force-dynamic";
export const revalidate = 0;


export default async function Page() {
  const serviceOrders = await getServiceOrders()
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset >
        <SiteHeader />
        <div className="min-h-screen p-2">
          <ServiceOrderDashboard serviceOrders={serviceOrders || []} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
