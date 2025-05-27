"use client"

import { LogOutIcon, MoreVerticalIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  const router = useRouter();
  const { data: session } = useSession();
  const initials = session?.user
    ? `${session.user.firstName[0]}${session.user.lastName[0]}`.toUpperCase()
    : "";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${session?.user?.email}`}
                  alt={`${session?.user?.firstName} ${session?.user?.lastName}`}
                />
                <AvatarFallback className="rounded-md bg-emerald-100 text-emerald-800">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{session?.user?.firstName} {session?.user?.lastName}</span>
                <span className="truncate text-xs text-muted-foreground">{session?.user?.email}</span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${session?.user?.email}`}
                    alt={`${session?.user?.firstName} ${session?.user?.lastName}`}
                  />
                  <AvatarFallback className="rounded-md bg-emerald-100 text-emerald-800">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{session?.user?.firstName} {session?.user?.lastName}</span>
                  <span className="truncate text-xs text-muted-foreground">{session?.user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
