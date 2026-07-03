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
import { Separator } from "@/components/ui/separator";

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
          <Card key={row.id} className="shadow-sm bg-card mb-2">
            {/* Header: Employee Info & Status Badge */}
            <CardHeader className="">
              <div>
                {flexRender(
                  cells[0].column.columnDef.cell,
                  cells[0].getContext(),
                )}
              </div>
              <CardAction className="">
                {flexRender(
                  cells[1].column.columnDef.cell,
                  cells[1].getContext(),
                )}
              </CardAction>
            </CardHeader>

            <Separator className="" />

            {/* Grid Details: Time In, Time Out, Logged Hours */}
            <CardContent className="-mx-6 -my-1">
              <div className="grid grid-cols-3 text-xs">
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
