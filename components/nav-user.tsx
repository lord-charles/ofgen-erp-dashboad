"use client";

import { useState } from "react"; // Added useState
import { LogOutIcon, MoreVerticalIcon, KeyRoundIcon } from "lucide-react"; // Added KeyRoundIcon
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Added Dialog components
import { PasswordResetForm } from "../app/login/password-reset-form"; // Added PasswordResetForm import
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const [showPasswordReset, setShowPasswordReset] = useState(false);

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
                <span className="truncate font-medium">
                  {session?.user?.firstName} {session?.user?.lastName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {session?.user?.email}
                </span>
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
                  <span className="truncate font-medium">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowPasswordReset(true)}>
              <KeyRoundIcon className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
          </DialogHeader>
          <PasswordResetForm
            onClose={() => setShowPasswordReset(false)}
            initialEmail={session?.user?.email || ""}
          />
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}
