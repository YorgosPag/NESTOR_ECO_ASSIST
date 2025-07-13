"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, FolderKanban, History, Leaf } from 'lucide-react';
import { Separator } from './ui/separator';
import { Header } from './layout/header';

function SidebarLogo() {
  const { state } = useSidebar();
  return (
    <div className="flex items-center gap-2 p-2">
      <Leaf className="size-8 text-sidebar-primary" />
      {state === 'expanded' && (
        <h1 className="text-xl font-bold text-sidebar-foreground">Prasina</h1>
      )}
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
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
                            <span className="text-sm font-semibold text-sidebar-foreground">PrasinaAdmin</span>
                            <span className="text-xs text-sidebar-foreground/70">admin@prasina.com</span>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <Header />
                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
        </>
    )
}
