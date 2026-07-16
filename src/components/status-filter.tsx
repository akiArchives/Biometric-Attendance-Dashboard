"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { IconFilter } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FILTERABLE_STATUSES = ["present", "late", "absent"] as const;
type FilterStatus = typeof FILTERABLE_STATUSES[number];

export function StatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine currently selected statuses
  const selectedStatuses = React.useMemo(() => {
    const statusParam = searchParams.get("status");
    if (!statusParam) {
      return new Set<FilterStatus>(FILTERABLE_STATUSES);
    }
    return new Set<FilterStatus>(
      statusParam
        .split(",")
        .filter((s): s is FilterStatus =>
          FILTERABLE_STATUSES.includes(s as FilterStatus)
        )
    );
  }, [searchParams]);

  const handleToggle = (status: FilterStatus) => {
    const newSelected = new Set(selectedStatuses);
    if (newSelected.has(status)) {
      newSelected.delete(status);
    } else {
      newSelected.add(status);
    }

    const params = new URLSearchParams(searchParams.toString());
    
    // If all statuses are selected, remove the param to keep the URL clean.
    if (newSelected.size === FILTERABLE_STATUSES.length) {
      params.delete("status");
    } else {
      params.set("status", Array.from(newSelected).join(","));
    }

    router.push(pathname + "?" + params.toString());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          title="Filter by Status"
        >
          <IconFilter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuCheckboxItem
          checked={selectedStatuses.has("present")}
          onCheckedChange={() => handleToggle("present")}
        >
          Present
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedStatuses.has("late")}
          onCheckedChange={() => handleToggle("late")}
        >
          Late
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedStatuses.has("absent")}
          onCheckedChange={() => handleToggle("absent")}
        >
          Absent
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
