"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IconBrandGithub } from "@tabler/icons-react";
import { DatePicker } from "@/components/ui/date-picker";
import * as React from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = React.useMemo(() => new Date().toISOString().split("T")[0], []);

  // Determine title, subtitle, and right-side controls based on path
  let title = "Dashboard";
  let subtitle = "Overview";
  let rightControls: React.ReactNode = (
    <p className="text-xs text-gray-400 mt-1">Today: {today}</p>
  );

  if (pathname === "/dashboard/analytics") {
    title = "Daily Attendance";
    const selectedDate = searchParams.get("date") || today;
    subtitle = selectedDate === today
      ? "Showing today's logs"
      : `Viewing logs for ${selectedDate}`;
    rightControls = (
      <div className="flex items-center gap-2">
        <DatePicker selected={selectedDate} />
      </div>
    );
  } else if (pathname === "/dashboard/reports") {
    title = "Reports";
    subtitle = "View and Export";
  } else if (pathname === "/dashboard/settings") {
    title = "Settings";
    subtitle = "Configuration";
  }

  return (
    <header className="flex h-17.25 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14.25">
      <div className="flex w-full items-center gap-1 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-7"
        />
        <h1 className="text-xl font-bold text-gray-700">{title}</h1>

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-7"
        />

        <p className="text-sm text-gray-400">{subtitle}</p>

        <div className="ml-auto flex items-center gap-2">
          {rightControls}
          <Button variant="ghost" className="ml-auto" asChild>
            <a
              href="https://github.com/akiArchives/Biometric-Attendance-Dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="size-fit m-0 dark:text-foreground"
            >
              <IconBrandGithub className="size-6 text-gray-700" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
