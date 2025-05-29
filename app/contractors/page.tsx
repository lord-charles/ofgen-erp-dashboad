import EmployeeModule from "./users/employees";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getAllEmployees } from "@/services/employees.service";
import { getAllSubcontractors } from "@/services/subcontractors.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EmployeesPage() {

  const [employeesData, subcontractorsData] = await Promise.all([
    getAllEmployees(),
    getAllSubcontractors(),
  ]);
  return (
    <SidebarProvider>
    <AppSidebar variant="inset" />
    <SidebarInset >
      <SiteHeader />
      <div className="min-h-screen">
        <div className="p-2">

        <EmployeeModule
          initialData={employeesData?.users || []}
          subcontractors={subcontractorsData || []}
        />
    </div>
      </div>
    </SidebarInset>
    </SidebarProvider>
  );
}
