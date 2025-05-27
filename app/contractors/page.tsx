import { SidebarProvider } from "@/components/ui/sidebar";

export default function ContractorsPage() {
  return (
    <SidebarProvider>
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Contractors</h1>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">Contractor Management</h3>
            <p className="text-sm text-muted-foreground">Manage contractor profiles and project assignments</p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
