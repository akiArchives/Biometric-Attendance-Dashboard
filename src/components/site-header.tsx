"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IconBrandGithub } from "@tabler/icons-react";
import { DatePicker } from "@/components/ui/date-picker";
import { ModeToggle } from "@/components/mode-toggle";
import * as React from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = React.useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Determine title, subtitle, and right-side controls based on path
  let title = "Dashboard";
  const subtitle = "";
  let rightControls: React.ReactNode;

  if (pathname === "/dashboard/analytics") {
    title = "Daily Attendance";
    const selectedDate = searchParams.get("date") || today;
    rightControls = (
      <div className="flex items-center gap-2">
        <DatePicker selected={selectedDate} />
      </div>
    );
  } else if (pathname === "/dashboard/reports") {
    title = "Reports";
  } else if (pathname === "/dashboard/settings") {
    title = "Settings";
  }

  return (
    <header className="flex h-17.25 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14.25">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="hidden md:block mx-2 data-[orientation=vertical]:h-7"
          />
          <h1 className="text-lg md:text-lg font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">
            {title}
          </h1>

          <p className="hidden md:block text-sm text-gray-400 dark:text-gray-300">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          {rightControls}
          <ModeToggle />
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <a
              href="https://github.com/akiArchives/Biometric-Attendance-Dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="size-fit m-0 dark:text-foreground"
            >
              <IconBrandGithub className="size-5 md:size-6 text-gray-700 dark:text-foreground" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
