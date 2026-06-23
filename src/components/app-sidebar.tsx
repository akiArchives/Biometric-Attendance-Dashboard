"use client";

import * as React from "react";
import { FingerprintPattern, LayoutDashboard } from "lucide-react";
import { NavMain } from "@/components/nav-main";
// import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ClipboardClock, ChartBar, Settings } from "lucide-react";

const data = {
  user: {
    name: "Joaquin",
    email: "example@gmail.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboard
          style={{ width: "1rem", height: "1rem" }}
          strokeWidth={2.5}
        />
      ),
    },
    {
      title: "Daily Logs",
      url: "/dashboard/analytics",
      icon: (
        <ClipboardClock
          style={{ width: "1rem", height: "1rem" }}
          strokeWidth={2.5}
        />
      ),
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: (
        <ChartBar style={{ width: "1rem", height: "1rem" }} strokeWidth={2.5} />
      ),
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: (
        <Settings style={{ width: "1rem", height: "1rem" }} strokeWidth={2.5} />
      ),
    },
  ],
  navSecondary: [{}, {}],
  projects: [{}, {}, {}],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <div className="my-2 mx-2 flex items-center gap-2">
          <FingerprintPattern className="size-8 text-sidebar-primary group-data-[collapsible=icon]:size-6" />
          <div className="grid text-left text-md leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-black text-sidebar-primary">
              C L I F S A
            </span>
            <span className="truncate text-xs text-sidebar-primary">
              Biometric Logs
            </span>
          </div>
        </div>
        <Separator
          orientation="horizontal"
          className="mx-2 data-horizontal:w-auto group-data-[collapsible=icon]:"
        />
      </SidebarHeader>

      <SidebarContent className="">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        <div className="flex justify-end group-data-[collapsible=icon]:justify-center">
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
