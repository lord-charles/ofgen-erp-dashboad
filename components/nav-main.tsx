"use client"

import { PlusIcon, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70">
        Main Navigation
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Create New Project"
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-md active:scale-95"
            >
              <PlusIcon className="transition-transform group-hover:scale-110" />
              <span className="font-medium">New Project</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="gap-2 mt-2">
          {items.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                  className="group relative transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:shadow-sm dark:data-[active=true]:bg-emerald-950/30 dark:data-[active=true]:text-emerald-400 border border-sidebar-border"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {item.icon && (
                      <item.icon
                        className={`transition-colors ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                      />
                    )}
                    <span className="font-medium">{item.title}</span>
                    {isActive && (
                      <div className="absolute right-2 h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
