"use client";

import * as React from 'react';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Header } from './layout/header';
import { SidebarNav } from './layout/sidebar-nav';
import { Toaster } from './ui/toaster';

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Sidebar>
                <SidebarNav />
            </Sidebar>
            <SidebarInset>
                <Header />
                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
            <Toaster />
        </>
    )
}
