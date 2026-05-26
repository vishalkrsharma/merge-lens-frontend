"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBug,
  IconBuildingWarehouse,
  IconGitBranch,
  IconGitPullRequest,
  IconLayoutDashboard,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MOCK_USER } from "@/data/mock";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/reviews", label: "Reviews", icon: IconGitPullRequest },
  { href: "/findings", label: "Findings", icon: IconBug },
  { href: "/repositories", label: "Repositories", icon: IconBuildingWarehouse },
];

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: IconSettings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <IconGitBranch size={20} className="text-primary" />
          <span className="font-mono font-semibold tracking-tight">MergeLens</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    className="flex items-center gap-2"
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    className="flex items-center gap-2"
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent"
              />
            }
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
              <AvatarFallback className="text-xs">
                {MOCK_USER.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <span className="font-medium leading-none">{MOCK_USER.name}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">@{MOCK_USER.githubLogin}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
              <IconLogout size={14} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
