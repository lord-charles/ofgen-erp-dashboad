"use client"

import type * as React from "react"
import type { LucideIcon } from "lucide-react"
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

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70 border border-sidebar-border">
        System
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="group relative transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:shadow-sm dark:data-[active=true]:bg-emerald-950/30 dark:data-[active=true]:text-emerald-400"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon
                      className={`transition-colors ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                    />
                    <span className="font-medium">{item.title}</span>
                    {isActive && (
                      <div className="absolute right-2 h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
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
