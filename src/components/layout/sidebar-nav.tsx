"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  FolderKanban,
  Shield,
  BookUser,
  Settings,
  LogOut,
} from "lucide-react";

const EcoFlowLogo = () => (
  <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-sidebar-primary"
      data-ai-hint="logo"
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">NESTOR eco</span>
  </div>
);

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
        return pathname === path;
    }
    return pathname.startsWith(path) && path !== '/';
  };

  return (
    <>
      <SidebarHeader>
        <EcoFlowLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard")}
              tooltip="Πίνακας Ελέγχου"
            >
              <Link href="/dashboard">
                <LayoutGrid />
                <span>Πίνακας Ελέγχου</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/projects")}
              tooltip="Λίστα Έργων"
            >
              <Link href="/projects">
                <FolderKanban />
                <span>Λίστα Έργων</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/contacts")}
              tooltip="Λίστα Επαφών"
            >
              <Link href="/contacts">
                <BookUser />
                <span>Λίστα Επαφών</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarGroup>
           <SidebarGroupLabel>Διαχείριση</SidebarGroupLabel>
           <SidebarGroupContent>
              <SidebarMenu>
                 <SidebarMenuItem>
                     <SidebarMenuButton asChild isActive={isActive("/admin")} tooltip="Κατάλογος Παρεμβάσεων">
                        <Link href="/admin">
                            <Shield />
                            <span>Κατάλογος Παρεμβάσεων</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                     <SidebarMenuButton asChild isActive={isActive("/settings")} tooltip="Ρυθμίσεις">
                        <Link href="/settings">
                            <Settings />
                            <span>Ρυθμίσεις</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                     <SidebarMenuButton tooltip="Αποσύνδεση">
                        <LogOut />
                        <span>Αποσύνδεση</span>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
           </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </>
  );
}
