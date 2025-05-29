import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAllProjects } from "@/services/project.service";
import ProjectModule from "./project";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  return (
       <SidebarProvider>
         <AppSidebar variant="inset" />
         <SidebarInset >
           <SiteHeader />
           <div className="min-h-screen p-2">
             <ProjectModule projects={projects || []} />
           </div>
         </SidebarInset>
       </SidebarProvider>
  )
}
