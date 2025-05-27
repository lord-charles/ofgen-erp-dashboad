"use client"

import { LogOutIcon, Moon, SettingsIcon, Sun, UserIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function SiteHeader() {
  const { setTheme, theme } = useTheme()
  const router = useRouter();
  const { data: session } = useSession();
  const initials = session?.user
    ? `${session.user.firstName[0]}${session.user.lastName[0]}`.toUpperCase()
    : "";

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 flex h-[48px] shrink-0 items-center gap-2 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-[width,height] ease-linear dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-1.5">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight">Welcome, Admin</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon"
                  className="hidden sm:flex relative overflow-hidden group"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 transition-transform group-hover:rotate-45 duration-300" />
                  ) : (
                    <Moon className="h-5 w-5 transition-transform group-hover:rotate-12 duration-300" />
                  )}
                  <span className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 rounded-md cursor-pointer">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${session?.user?.email}`}
                  alt={`${session?.user?.firstName} ${session?.user?.lastName}`}
                />
                <AvatarFallback className="rounded-md bg-emerald-100 text-emerald-800">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="text-sm font-medium">
                  {session?.user?.firstName || ""} {session?.user?.lastName || ""}
                </div>
                <div className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
