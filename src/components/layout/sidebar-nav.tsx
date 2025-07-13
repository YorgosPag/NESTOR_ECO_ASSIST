"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, History, FolderKanban } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/app/logo";

function SidebarLogo() {
  const { state } = useSidebar();
  return (
    <div className="flex items-center gap-2 p-2">
      <Logo className="size-8 text-primary" />
      {state === 'expanded' && (
        <h1 className="text-xl font-bold">Prasina</h1>
      )}
    </div>
  );
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/'}
              tooltip="Dashboard"
            >
              <Link href="/">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/project')}
              tooltip="Projects"
            >
              <Link href="/">
                <FolderKanban />
                <span>Projects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/audit-trail')}
              tooltip="Audit Trail"
            >
              <Link href="/audit-trail">
                <History />
                <span>Audit Trail</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <Separator className="my-2 bg-sidebar-border" />
         <div className="flex items-center gap-2 p-2">
           <Avatar className="size-9">
             <AvatarImage data-ai-hint="person" src="https://placehold.co/40x40" alt="User" />
             <AvatarFallback>PA</AvatarFallback>
           </Avatar>
           <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold text-sidebar-foreground">Prasina Admin</span>
              <span className="text-xs text-sidebar-foreground/70">admin@prasina.app</span>
           </div>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
