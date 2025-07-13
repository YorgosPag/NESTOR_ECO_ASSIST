"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FolderKanban, Settings, LogOut, Leaf } from 'lucide-react';
import { Separator } from './ui/separator';

function SidebarLogo() {
  const { state } = useSidebar();
  return (
    <div className="flex items-center gap-2 p-2">
      <Leaf className="size-8 text-primary" />
      {state === 'expanded' && (
        <h1 className="text-xl font-bold">EcoAssist</h1>
      )}
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
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
                isActive={pathname.startsWith('/projects')}
                tooltip="Projects"
              >
                <Link href="/">
                  <FolderKanban />
                  <span>Projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <Separator className="my-2" />
           <div className="flex items-center gap-2 p-2">
             <Avatar className="size-9">
               <AvatarImage src="https://placehold.co/40x40" alt="User" />
               <AvatarFallback>EA</AvatarFallback>
             </Avatar>
             <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-sidebar-foreground">EcoAdmin</span>
                <span className="text-xs text-sidebar-foreground/70">admin@eco.assist</span>
             </div>
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-40">
           <SidebarTrigger className="md:hidden" />
           <div className="flex-1">
             {/* Can add breadcrumbs here */}
           </div>
           <Button variant="ghost" size="icon">
             <Settings className="size-5" />
           </Button>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
