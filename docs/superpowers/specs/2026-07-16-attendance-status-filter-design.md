# Design Document: Attendance Status Filter

Add a status filter dropdown (multi-select icon button) beside the date picker in the Analytics panel. This filter allows users to narrow down the daily attendance table by statuses: **Present**, **Late**, and **Absent**.

## Selected Approach: URL Search Parameter with Server-Side Filtering (Approach A)

The active filter state is persisted in the URL query parameter `status` as a comma-separated list of values (e.g. `?status=present,late`). This allows the state to be bookmarkable and aligns with the existing `date` query parameter implementation.

---

## Proposed Changes

### 1. `SiteHeader` Component

#### [MODIFY] [site-header.tsx](file:///c:/Users/wakie/Documents/Projects/clifsa-attendance/attendance-dashboard/src/components/site-header.tsx)
- Import `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, and `DropdownMenuCheckboxItem` from `@/components/ui/dropdown-menu`.
- Import `IconFilter` from `@tabler/icons-react` to use as the button icon.
- Retrieve the `status` search parameter. If it's empty, default to all three filterable statuses: `['present', 'late', 'absent']`.
- Add a new icon button next to the `DatePicker` inside `rightControls` for the dashboard analytics page.
- Render the dropdown menu with checkboxes for "Present", "Late", and "Absent".
- Toggling a checkbox will update the URL search params:
  - If all three statuses are checked, delete the `status` query parameter to keep the URL clean.
  - Otherwise, set `status` to the comma-separated list of selected statuses.
  - Navigate to the new URL using `router.push()`.

### 2. Analytics Page

#### [MODIFY] [page.tsx](file:///c:/Users/wakie/Documents/Projects/clifsa-attendance/attendance-dashboard/src/app/dashboard/analytics/page.tsx)
- Update `PageProps` to include `status` in the search parameters.
- Retrieve and parse the `status` search parameter.
- Filter the output of `processDailyLogs` by the active statuses:
  ```typescript
  const statusParam = resolvedParams.status;
  const selectedStatuses = statusParam ? statusParam.split(",") : [];
  
  const filteredData = selectedStatuses.length > 0
    ? processedData.filter((item) => selectedStatuses.includes(item.status))
    : processedData;
  ```
- Pass `filteredData` to the `AttendanceTable` component instead of `processedData`.

---

## Verification Plan

### Manual Verification
1. Navigate to `/dashboard/analytics`.
2. Observe the new filter icon button beside the date picker.
3. Click the filter icon to reveal the dropdown menu. Ensure all three options (Present, Late, Absent) are checked by default, and the URL does not contain a `status` query parameter.
4. Uncheck **Absent**.
   - Verify the URL changes to `?status=present,late` (and includes the selected date if set).
   - Verify the table dynamically updates to exclude any "Absent" employees.
5. Uncheck **Late** (only **Present** is checked).
   - Verify the URL changes to `?status=present`.
   - Verify the table displays only "Present" employees.
6. Re-check all options.
   - Verify the `status` query parameter is removed from the URL.
   - Verify all employees are displayed.
