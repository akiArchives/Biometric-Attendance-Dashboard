"use client";

import * as React from "react";
import { FingerprintPattern } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { IconDashboard, IconListDetails, IconReport, IconPlus } from "@tabler/icons-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <IconDashboard
          style={{ width: "1rem", height: "1rem" }}
          strokeWidth={2.5}
        />
      ),
    },
    {
      title: "Daily Logs",
      url: "/dashboard/analytics",
      icon: (
        <IconListDetails
          style={{ width: "1rem", height: "1rem" }}
          strokeWidth={2.5}
        />
      ),
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: (
        <IconReport style={{ width: "1rem", height: "1rem" }} strokeWidth={2.5} />
      ),
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: (
        <Settings2 style={{ width: "1rem", height: "1rem" }} strokeWidth={2.5} />
      ),
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string;
    email: string;
    avatar: string;
    role?: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <div className="my-2 mx-2 flex items-center gap-2">
          <FingerprintPattern className="size-8 text-sidebar-primary dark:text-blue-400 group-data-[collapsible=icon]:size-6" />
          <div className="grid text-left text-md leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-black text-sidebar-primary dark:text-blue-100">
              C L I F S A
            </span>
            <span className="truncate text-xs text-sidebar-primary dark:text-blue-300">
              Biometric Logs
            </span>
          </div>
        </div>
        <Separator
          orientation="horizontal"
          className="mx-1 data-horizontal:w-auto group-data-[collapsible=icon]:self-stretch group-data-[collapsible=icon]:mx-1"
        />
      </SidebarHeader>

      <SidebarContent className="">
        <NavMain items={data.navMain} />
        {user?.role === "admin" && (
          <div className="px-4 py-2 group-data-[collapsible=icon]:px-2 animate-fade-in">
            <Button
              className="w-full gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 justify-start px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
              title="Add Attendance"
            >
              <IconPlus className="size-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Add Attendance</span>
            </Button>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
