"use client";

import * as React from "react";
import { useState } from "react";
import AddContractorDialog from "@/components/add-contractor-dialog";
import AddSubcontractorDialog from "@/components/add-subcontractor";
import ServiceOrderDialog from "@/components/service-order-dialog";
import { AddLocationDialog } from "@/app/locations/components/add-location-dialog";
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
import { useToast } from "@/hooks/use-toast";

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

export function NavSecondary({
  ...props
}: {} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] = useState(false);

  const [isAddServiceOrderDialogOpen, setIsAddServiceOrderDialogOpen] =
    useState(false);

  const [isAddContractorDialogOpen, setIsAddContractorDialogOpen] =
    useState(false);
  const [isAddSubcontractorDialogOpen, setIsAddSubcontractorDialogOpen] =
    useState(false);

  const isAnalyticsActive = pathname === "/dashboard";
  const isSettingsActive = pathname === "/settings";

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70 border border-sidebar-border">
        System
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1 mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isAnalyticsActive}
              className="group relative transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:shadow-sm dark:data-[active=true]:bg-emerald-950/30 dark:data-[active=true]:text-emerald-400"
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <BarChart3Icon
                  className={`transition-colors ${
                    isAnalyticsActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : ""
                  }`}
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
              onClick={() => {
                toast({
                  title: "Settings",
                  description: "Settings feature coming soon!",
                });
              }}
            >
              <div className="flex items-center gap-3">
                <SettingsIcon
                  className={`transition-colors ${
                    isSettingsActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : ""
                  }`}
                />
                <span className="font-medium text-md">Settings</span>
                {isSettingsActive && (
                  <div className="absolute right-2 h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

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

                {/* Quick Actions */}
                <React.Fragment>
                  <DropdownMenuItem
                    onClick={() => setIsAddLocationDialogOpen(true)}
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
                    onClick={() => setIsAddServiceOrderDialogOpen(true)}
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
                    onClick={() => setIsAddContractorDialogOpen(true)}
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
                    onClick={() => setIsAddSubcontractorDialogOpen(true)}
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
            <AddLocationDialog
              open={isAddLocationDialogOpen}
              setOpen={setIsAddLocationDialogOpen}
            />
            <AddContractorDialog
              open={isAddContractorDialogOpen}
              setOpen={setIsAddContractorDialogOpen}
              onAdd={() => setIsAddContractorDialogOpen(false)}
            />
            <AddSubcontractorDialog
              open={isAddSubcontractorDialogOpen}
              setOpen={setIsAddSubcontractorDialogOpen}
              onAdd={() => setIsAddSubcontractorDialogOpen(false)}
            />
            <ServiceOrderDialog
              open={isAddServiceOrderDialogOpen}
              setOpen={setIsAddServiceOrderDialogOpen}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
