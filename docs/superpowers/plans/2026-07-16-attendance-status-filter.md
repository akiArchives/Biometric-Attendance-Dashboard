# Attendance Status Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a multi-select status filter dropdown (icon button) next to the date picker in the dashboard analytics site header to filter the attendance table by statuses (present, late, absent) using URL query parameters.

**Architecture:** Use URL query parameter `status` to store selected statuses as a comma-separated string (e.g. `?status=present,late`). Filter the attendance data server-side in `AttendancePage` before rendering the table. The `StatusFilter` component in `SiteHeader` will read and update the URL.

**Tech Stack:** Next.js (App Router), React, Radix UI (Dropdown Menu via shadcn), Lucide React / Tabler Icons.

## Global Constraints
- Naming rules: Keep search parameter named `status` (lower-case).
- Keep UI aesthetics premium: use clean styling, matching border/background of existing elements, and hover states.
- Follow Git branch isolation: Make all changes on the `feature/attendance-status-filter` branch.

---

### Task 1: Update Analytics Page Server-Side Filtering

**Files:**
- Modify: `src/app/dashboard/analytics/page.tsx`

**Interfaces:**
- Consumes: `searchParams` from page routing.
- Produces: `filteredData` passed to `<AttendanceTable />`.

- [ ] **Step 1: Modify Analytics Page component**
  Edit [page.tsx](file:///c:/Users/wakie/Documents/Projects/clifsa-attendance/attendance-dashboard/src/app/dashboard/analytics/page.tsx) to:
  1. Add `status` optional field to `searchParams` in `PageProps`.
  2. Parse the `status` search parameter. If not provided, default to displaying all statuses.
  3. Filter the `processedData` using the parsed status list before passing it to `AttendanceTable`.

  ```typescript
  // Replace the PageProps and AttendancePage return block in src/app/dashboard/analytics/page.tsx:
  
  interface PageProps {
    searchParams: Promise<{ date?: string; status?: string }>;
  }
  
  // ... inside AttendancePage function, after processedData is computed:
  const resolvedParams = await searchParams;
  const statusParam = resolvedParams.status;
  const selectedStatuses = statusParam ? statusParam.split(",") : [];

  const filteredData = selectedStatuses.length > 0
    ? processedData.filter((item) => selectedStatuses.includes(item.status))
    : processedData;

  return (
    <div className="w-full h-auto mt-6 px-6">
      <AttendanceTable data={filteredData} />
    </div>
  );
  ```

- [ ] **Step 2: Verify the page builds successfully**
  Run: `pnpm run build` or `pnpm test`
  Expected: Successful compilation without TypeScript errors.

- [ ] **Step 3: Commit Task 1 changes**
  ```bash
  git add src/app/dashboard/analytics/page.tsx
  git commit -m "feat: add status search param parsing and server-side filtering on analytics page"
  ```

---

### Task 2: Implement and Add the `StatusFilter` Component

**Files:**
- Create: `src/components/status-filter.tsx`
- Modify: `src/components/site-header.tsx`

- [ ] **Step 1: Create the `StatusFilter` component file**
  Create the new component file [status-filter.tsx](file:///c:/Users/wakie/Documents/Projects/clifsa-attendance/attendance-dashboard/src/components/status-filter.tsx) with the following content:

  ```typescript
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
      // If no statuses are selected, set to empty or custom value.
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
  ```

- [ ] **Step 2: Add `StatusFilter` beside `DatePicker` in `SiteHeader`**
  Modify [site-header.tsx](file:///c:/Users/wakie/Documents/Projects/clifsa-attendance/attendance-dashboard/src/components/site-header.tsx) to:
  1. Import the newly created `StatusFilter` component.
  2. Render it inside `rightControls` next to `<DatePicker>`.

  ```typescript
  // Imports:
  import { StatusFilter } from "@/components/status-filter";

  // In rightControls mapping:
  if (pathname === "/dashboard/analytics") {
    title = "Daily Attendance";
    const selectedDate = searchParams.get("date") || today;
    rightControls = (
      <div className="flex items-center gap-2">
        <DatePicker selected={selectedDate} />
        <StatusFilter />
      </div>
    );
  }
  ```

- [ ] **Step 3: Run project tests and compilation check**
  Run: `pnpm run build`
  Expected: Successful compilation without TypeScript errors.

- [ ] **Step 4: Commit Task 2 changes**
  ```bash
  git add src/components/status-filter.tsx src/components/site-header.tsx
  git commit -m "feat: implement StatusFilter dropdown and integrate it into SiteHeader"
  ```

---

## Verification Plan

### Automated Tests
- Run `pnpm test` to ensure existing unit tests continue to pass.

### Manual Verification
1. Run `pnpm run dev` to start the local Next.js server.
2. Open a browser and navigate to `/dashboard/analytics`.
3. Check the filter icon button next to the date picker. Click it and toggle "Absent".
   - Confirm the URL updates to `?status=present,late`.
   - Confirm the table updates, removing "Absent" employees from view.
4. Toggle "Late" so only "Present" is checked.
   - Confirm the URL is `?status=present`.
   - Confirm only "Present" employees are visible.
5. Check all items again.
   - Confirm the `status` param is deleted from the URL.
   - Confirm all employees are visible.
