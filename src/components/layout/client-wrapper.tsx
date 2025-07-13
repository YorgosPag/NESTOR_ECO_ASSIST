"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayout } from "@/components/app-layout";
import { TooltipProvider } from "@/components/ui/tooltip";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppLayout>{children}</AppLayout>
      </TooltipProvider>
    </SidebarProvider>
  );
}
