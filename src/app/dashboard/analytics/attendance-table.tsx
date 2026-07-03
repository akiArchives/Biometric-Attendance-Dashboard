"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns, PersonnelAnalytics } from "./columns";
import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { flexRender, Row } from "@tanstack/react-table";

interface AttendanceTableProps {
  data: PersonnelAnalytics[];
}

export function AttendanceTable({ data }: AttendanceTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      renderMobileCard={(row: Row<PersonnelAnalytics>) => {
        const cells = row.getVisibleCells();
        return (
          <Card key={row.id} className="shadow-md border border-border bg-card">
            {/* Header: Employee Info & Status Badge */}
            <CardHeader className="border-b pb-3">
              <div>
                {flexRender(
                  cells[0].column.columnDef.cell,
                  cells[0].getContext(),
                )}
              </div>
              <CardAction className="pt-1">
                {flexRender(
                  cells[1].column.columnDef.cell,
                  cells[1].getContext(),
                )}
              </CardAction>
            </CardHeader>

            {/* Grid Details: Time In, Time Out, Logged Hours */}
            <CardContent className="">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex flex-col gap-1 items-center text-center rounded-lg bg-muted/20">
                  <span className="text-muted-foreground font-medium">
                    Time In
                  </span>
                  {flexRender(
                    cells[2].column.columnDef.cell,
                    cells[2].getContext(),
                  )}
                </div>
                <div className="flex flex-col gap-1 items-center text-center rounded-lg bg-muted/20">
                  <span className="text-muted-foreground font-medium">
                    Time Out
                  </span>
                  {flexRender(
                    cells[3].column.columnDef.cell,
                    cells[3].getContext(),
                  )}
                </div>
                <div className="flex flex-col gap-1 items-center text-center rounded-lg bg-muted/20">
                  <span className="text-muted-foreground font-medium">
                    Logged
                  </span>
                  {flexRender(
                    cells[4].column.columnDef.cell,
                    cells[4].getContext(),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }}
    />
  );
}
