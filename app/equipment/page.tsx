import { SidebarProvider } from "@/components/ui/sidebar";

export default function EquipmentPage() {
  return (
    <SidebarProvider>
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Equipment</h1>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">Equipment Management</h3>
            <p className="text-sm text-muted-foreground">Manage specialized electronic equipment and tools</p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
