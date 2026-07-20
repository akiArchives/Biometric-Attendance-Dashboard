"use client";

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
import { Calendar as CalendarIcon, Table as TableIcon } from "lucide-react";
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
  const columnVisibility = {
    date: Boolean(isSingleUserView),
    employee_name: !isSingleUserView,
    actions: Boolean(isAdmin),
  };

  const userEmpId = Number(userEmployee?.employee_id || 0);

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
      {userEmployee && (
        <div className="p-3.5 rounded-lg border bg-muted/30 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {userEmployee.employee_name}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              ID: {userEmployee.employee_id}
            </span>
          </div>
          <span className="text-xs text-muted-foreground bg-background px-2.5 py-1 rounded-md border font-medium">
            Personal Attendance History
          </span>
        </div>
      )}

      <Tabs defaultValue="calendar" className="w-full">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <TabsList className="grid w-full max-w-[280px] grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center gap-1.5 text-xs">
              <CalendarIcon className="h-3.5 w-3.5" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-1.5 text-xs">
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
          />
        </TabsContent>

        <TabsContent value="table" className="mt-0 outline-none">
          {dataTableElement}
        </TabsContent>
      </Tabs>
    </div>
  );
}
