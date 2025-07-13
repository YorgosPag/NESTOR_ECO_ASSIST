"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayout } from "@/components/app-layout";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayout>{children}</AppLayout>
    </SidebarProvider>
  );
}
