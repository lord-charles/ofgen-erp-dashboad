"use client";

import * as React from "react";
import { useState } from "react";
import {
  BarChart3Icon,
  HardDriveIcon,
  SettingsIcon,
  ChevronDownIcon,
  PlusIcon,
  BuildingIcon,
  ClipboardListIcon,
  UsersIcon,
  UserCheckIcon,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface QuickAction {
  title: string;
  icon: LucideIcon;
  action: () => void;
  description: string;
}

export function NavSecondary({
  ...props
}: {} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  // Quick Actions - no map, explicit rendering
  const quickActionNewSite: QuickAction = {
    title: "New Site",
    icon: BuildingIcon,
    description: "Create a new site/location",
    action: () => {
      console.log("Creating new site...");
      // Add your navigation or modal logic here
      // Example: router.push('/sites/create')
    },
  };
  const quickActionServiceOrder: QuickAction = {
    title: "Service Order",
    icon: ClipboardListIcon,
    description: "Create a new service order",
    action: () => {
      console.log("Creating new service order...");
      // Add your navigation or modal logic here
      // Example: router.push('/orders/create')
    },
  };
  const quickActionContractor: QuickAction = {
    title: "Contractor",
    icon: UsersIcon,
    description: "Add a new contractor",
    action: () => {
      console.log("Creating new contractor...");
      // Add your navigation or modal logic here
      // Example: router.push('/contractors/create')
    },
  };
  const quickActionSubcontractor: QuickAction = {
    title: "Subcontractor",
    icon: UserCheckIcon,
    description: "Add a new subcontractor",
    action: () => {
      console.log("Creating new subcontractor...");
      // Add your navigation or modal logic here
      // Example: router.push('/subcontractors/create')
    },
  };

  // Regular Items - no map, explicit rendering
  const isAnalyticsActive = pathname === "/dashboard";
  const isSettingsActive = pathname === "/settings";

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70 border border-sidebar-border">
        System
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {/* Regular navigation items - explicit rendering */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isAnalyticsActive}
              className="group relative transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:shadow-sm dark:data-[active=true]:bg-emerald-950/30 dark:data-[active=true]:text-emerald-400"
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <BarChart3Icon
                  className={`transition-colors ${isAnalyticsActive ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                />
                <span className="font-medium">Analytics</span>
                {isAnalyticsActive && (
                  <div className="absolute right-2 h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isSettingsActive}
              className="group relative transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:shadow-sm dark:data-[active=true]:bg-emerald-950/30 dark:data-[active=true]:text-emerald-400"
            >
              <Link href="/settings" className="flex items-center gap-3">
                <SettingsIcon
                  className={`transition-colors ${isSettingsActive ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                />
                <span className="font-medium">Settings</span>
                {isSettingsActive && (
                  <div className="absolute right-2 h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Quick Actions Dropdown */}
          <SidebarMenuItem>
            <DropdownMenu
              open={isQuickActionsOpen}
              onOpenChange={setIsQuickActionsOpen}
            >
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="group relative transition-all duration-200 hover:bg-sidebar-accent/50 focus:bg-sidebar-accent/50 data-[state=open]:bg-sidebar-accent">
                  <div className="flex items-center gap-3 w-full">
                    <HardDriveIcon className="transition-colors" />
                    <span className="font-medium">Quick Actions</span>
                    <ChevronDownIcon
                      className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                        isQuickActionsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                side="right"
                className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-50"
                sideOffset={8}
              >
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Create New
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Quick access to common actions
                  </p>
                </div>

                {/* Quick Actions - explicit rendering, no map */}
                <React.Fragment>
                  <DropdownMenuItem
                    onClick={quickActionNewSite.action}
                    className="group flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 focus:bg-emerald-50 dark:focus:bg-emerald-950/30 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900 transition-colors">
                      <BuildingIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PlusIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          New Site
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Create a new site/location
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />
                  <DropdownMenuItem
                    onClick={quickActionServiceOrder.action}
                    className="group flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 focus:bg-emerald-50 dark:focus:bg-emerald-950/30 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900 transition-colors">
                      <ClipboardListIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PlusIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Service Order
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Create a new service order
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />
                  <DropdownMenuItem
                    onClick={quickActionContractor.action}
                    className="group flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 focus:bg-emerald-50 dark:focus:bg-emerald-950/30 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900 transition-colors">
                      <UsersIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PlusIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Contractor
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Add a new contractor
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />
                  <DropdownMenuItem
                    onClick={quickActionSubcontractor.action}
                    className="group flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 focus:bg-emerald-50 dark:focus:bg-emerald-950/30 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900 transition-colors">
                      <UserCheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PlusIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Subcontractor
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Add a new subcontractor
                      </p>
                    </div>
                  </DropdownMenuItem>
                </React.Fragment>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
