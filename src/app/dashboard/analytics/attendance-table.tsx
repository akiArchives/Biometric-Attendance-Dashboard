"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns, PersonnelAnalytics } from "./columns";
import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { flexRender, Row } from "@tanstack/react-table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeAttendanceCalendar } from "@/components/employee-attendance-calendar";
import { RawBiometricLog } from "@/utils/attendance-processor";

interface AttendanceTableProps {
  data: PersonnelAnalytics[];
  isAdmin?: boolean;
  isSingleUserView?: boolean;
  userEmployee?: { employee_name: string; employee_id: string };
  rawLogs?: RawBiometricLog[];
  workStartTime?: string;
  gracePeriod?: number;
}

export function AttendanceTable({
  data,
  isAdmin,
  isSingleUserView,
  userEmployee,
  rawLogs = [],
  workStartTime = "09:00",
  gracePeriod = 15,
}: AttendanceTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const columnVisibility = {
    date: Boolean(isSingleUserView),
    employee_name: !isSingleUserView,
    actions: Boolean(isAdmin),
  };

  const userEmpId = Number(userEmployee?.employee_id || 0);

  const todayObj = useMemo(() => new Date(), []);
  const dateParam = searchParams ? searchParams.get("date") : null;

  const { currentYear, currentMonth } = useMemo(() => {
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      const [yStr, mStr] = dateParam.split("-");
      const y = parseInt(yStr, 10);
      const m = parseInt(mStr, 10);
      if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
        return { currentYear: y, currentMonth: m };
      }
    }
    if (rawLogs && rawLogs.length > 0) {
      const firstLog = rawLogs.find((l) => l.log_date || l.log_date_time);
      const dateStr =
        firstLog?.log_date || firstLog?.log_date_time?.substring(0, 10);
      if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [yStr, mStr] = dateStr.split("-");
        const y = parseInt(yStr, 10);
        const m = parseInt(mStr, 10);
        if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
          return { currentYear: y, currentMonth: m };
        }
      }
    }
    return {
      currentYear: todayObj.getFullYear(),
      currentMonth: todayObj.getMonth() + 1,
    };
  }, [dateParam, rawLogs, todayObj]);

  const monthLabel = useMemo(() => {
    const d = new Date(currentYear, currentMonth - 1, 1);
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear = currentYear - 1;
    }
    const formattedDate = `${newYear}-${String(newMonth).padStart(2, "0")}-01`;
    router.push("/dashboard/analytics?date=" + formattedDate);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear = currentYear + 1;
    }
    const formattedDate = `${newYear}-${String(newMonth).padStart(2, "0")}-01`;
    router.push("/dashboard/analytics?date=" + formattedDate);
  };

  const handleToday = () => {
    const newYear = todayObj.getFullYear();
    const newMonth = todayObj.getMonth() + 1;
    const formattedDate = `${newYear}-${String(newMonth).padStart(2, "0")}-01`;
    router.push("/dashboard/analytics?date=" + formattedDate);
  };

  const dataTableElement = (
    <DataTable
      columns={columns}
      data={data}
      columnVisibility={columnVisibility}
      renderMobileCard={(row: Row<PersonnelAnalytics>) => {
        const cells = row.getVisibleCells();
        const getCell = (columnId: string) =>
          cells.find((c) => c.column.id === columnId);
        const empCell = getCell("employee_name");
        const statusCell = getCell("status");
        const firstPunchCell = getCell("first_punch");
        const lastPunchCell = getCell("last_punch");
        const totalHoursCell = getCell("total_hours_worked");
        const actionsCell = getCell("actions");

        return (
          <Card key={row.id} className="shadow-sm bg-card mb-2">
            {/* Header: Employee Info & Status Badge */}
            <CardHeader className="">
              <div>
                {empCell &&
                  flexRender(
                    empCell.column.columnDef.cell,
                    empCell.getContext(),
                  )}
                {row.original.date && (
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    Date: {row.original.date}
                  </div>
                )}
              </div>
              <CardAction className="">
                {statusCell &&
                  flexRender(
                    statusCell.column.columnDef.cell,
                    statusCell.getContext(),
                  )}
              </CardAction>
            </CardHeader>

            <Separator className="w-0" />

            {/* Grid Details: Time In, Time Out, Logged Hours */}
            <CardContent className="-mx-6 -my-1">
              <div className="grid grid-cols-3 text-xs">
                <div className="flex flex-col gap-1 items-center text-center rounded-lg">
                  <span className="text-muted-foreground font-medium">
                    Time In
                  </span>
                  {firstPunchCell &&
                    flexRender(
                      firstPunchCell.column.columnDef.cell,
                      firstPunchCell.getContext(),
                    )}
                </div>
                <div className="flex flex-col gap-1 items-center text-center rounded-lg">
                  <span className="text-muted-foreground font-medium">
                    Time Out
                  </span>
                  {lastPunchCell &&
                    flexRender(
                      lastPunchCell.column.columnDef.cell,
                      lastPunchCell.getContext(),
                    )}
                </div>
                <div className="flex flex-col gap-1 items-center text-center rounded-lg">
                  <span className="text-muted-foreground font-medium">
                    Logged
                  </span>
                  {totalHoursCell &&
                    flexRender(
                      totalHoursCell.column.columnDef.cell,
                      totalHoursCell.getContext(),
                    )}
                </div>
              </div>
            </CardContent>

            {actionsCell && (
              <CardFooter className="py-2 flex justify-end gap-2 px-0 bg-muted/5 rounded-b-lg">
                {flexRender(
                  actionsCell.column.columnDef.cell,
                  actionsCell.getContext(),
                )}
              </CardFooter>
            )}
          </Card>
        );
      }}
    />
  );

  if (!isSingleUserView) {
    return dataTableElement;
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="calendar" className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                {monthLabel}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 ml-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevMonth}
                className="h-8 px-2.5"
                aria-label="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="h-8 px-3 text-xs font-medium"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
                className="h-8 px-2.5"
                aria-label="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-1.5 text-xs px-4"
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="flex items-center gap-1.5 text-xs px-4"
            >
              <TableIcon className="h-3.5 w-3.5" />
              Table View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="calendar" className="mt-0 outline-none">
          <EmployeeAttendanceCalendar
            logs={rawLogs}
            employeeId={userEmpId}
            workStartTime={workStartTime}
            gracePeriod={gracePeriod}
            hideMonthNavigation={true}
          />
        </TabsContent>

        <TabsContent value="table" className="mt-0 outline-none">
          {dataTableElement}
        </TabsContent>
      </Tabs>
    </div>
  );
}
