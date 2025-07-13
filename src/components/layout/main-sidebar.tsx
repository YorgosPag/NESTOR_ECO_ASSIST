"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History } from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/app/logo";

export function MainSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/audit-trail", label: "Audit Trail", icon: History },
  ];

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Prasina</h1>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
