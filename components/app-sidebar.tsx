"use client"

import type * as React from "react"
import {
  BarChart3Icon,
  BoxIcon,
  FileTextIcon,
  HardDriveIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  NetworkIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "John Doe",
    email: "john@ofgen.africa",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Service Orders",
      url: "/service-orders",
      icon: FileTextIcon,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: NetworkIcon,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: BoxIcon,
    },
    {
      title: "Locations",
      url: "/locations",
      icon: MapPinIcon,
    },

    {
      title: "Contractors",
      url: "/contractors",
      icon: UsersIcon,
    },
  ],
  navSecondary: [
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3Icon,
    },
    {
      title: "Equipment",
      url: "/equipment",
      icon: HardDriveIcon,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar p-0">
        <SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem className="py-2"
            >
              <SidebarMenuButton
                tooltip="Home"
                className="group relative overflow-hidden   shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-md active:scale-95 "
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className=" bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-sm p-0.5">
                    <NetworkIcon className="transition-transform group-hover:scale-110 p-1 text-white" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-lg font-bold tracking-tight">OFGEN LIMITED</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>


        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border bg-sidebar">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
