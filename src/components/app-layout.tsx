"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FolderKanban, Settings, History, Leaf } from 'lucide-react';
import { Separator } from './ui/separator';
import { ThemeToggle } from './layout/theme-toggle';
import { useSidebar } from '@/hooks/use-sidebar';

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
                <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
                    <SidebarTrigger className="md:hidden" />
                    <div className="flex-1">
                        {/* Can add breadcrumbs here */}
                    </div>
                    <ThemeToggle />
                    <Button variant="ghost" size="icon">
                        <Settings className="size-5" />
                    </Button>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
        </>
    )
}
