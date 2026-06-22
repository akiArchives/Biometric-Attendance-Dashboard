"use client";

import * as React from "react";
import { FingerprintPattern } from "lucide-react";
import { NavMain } from "@/components/nav-main";
// import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ClipboardClock, Users, SquareActivity } from "lucide-react";

const data = {
  user: {
    name: "Joaquin",
    email: "example@gmail.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Live Feed",
      url: "/dashboard/live-feed",
      icon: <SquareActivity style={{ width: "1.25rem", height: "1.25rem" }} />,
      isActive: true,
    },
    {
      title: "Daily Logs",
      url: "/dashboard/analytics",
      icon: <ClipboardClock style={{ width: "1.25rem", height: "1.25rem" }} />,
    },
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: <Users style={{ width: "1.25rem", height: "1.25rem" }} />,
    },
  ],
  navSecondary: [{}, {}],
  projects: [{}, {}, {}],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <FingerprintPattern className="size-9" />
          <div className="grid text-left text-lg leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-black">C L I F S A</span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              Biometric Logs
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-5">
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/*<SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>*/}
    </Sidebar>
  );
}
