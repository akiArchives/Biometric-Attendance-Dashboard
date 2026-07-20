"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconCalendar,
  IconAlarmFilled,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

function formatRawTime(iso: string): string {
  const [h, m] = iso.substring(11, 16).split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const display = h % 12 || 12;
  return `${display}:${String(m).padStart(2, "0")} ${ampm}`;
}

export type AttendanceStatus = "present" | "late" | "absent" | "on_leave";

export type PersonnelAnalytics = {
  employee_id: string;
  employee_name: string;
  department_name?: string;
  first_punch: string | null;
  last_punch: string | null;
  total_hours_worked: number;
  status: AttendanceStatus;
  date?: string;
};

export const columns: ColumnDef<PersonnelAnalytics>[] = [
  {
    accessorKey: "employee_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent dark:text-slate-100 animate-fade-in"
        >
          Employee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("employee_name") as string;
      const empId = row.original.employee_id;
      const dept = row.original.department_name;

      return (
        <div className="flex items-center gap-3 animate-fade-in">
          <div>
            <div className="ml-2 font-semibold text-slate-900 dark:text-slate-100 capitalize">
              {name || "Unregistered Token"}
            </div>
            <div className="ml-2 text-xs text-slate-400 dark:text-slate-500 font-mono">
              ID: {empId} {dept && `• ${dept}`}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-center flex w-fit mx-auto hover:bg-transparent dark:text-slate-100 animate-fade-in"
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateVal = row.getValue("date") as string | undefined;
      if (!dateVal)
        return (
          <span className="text-slate-400 text-xs flex w-fit mx-auto">—</span>
        );

      return (
        <div className="flex w-fit mx-auto items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono text-xs font-medium animate-fade-in">
          {dateVal}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-center flex w-fit mx-auto hover:bg-transparent dark:text-slate-100 animate-fade-in"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4 data-[state=sorted]:border-blue-500 data-[state=sorted]:border data-[state=sorted]:text-blue-500" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as AttendanceStatus;

      const styles: Record<
        AttendanceStatus,
        { icon: React.ReactNode; label: string }
      > = {
        present: {
          icon: (
            <IconCircleCheckFilled
              size={14}
              className="text-emerald-500 shrink-0"
            />
          ),
          label: "Present",
        },
        late: {
          icon: (
            <IconAlarmFilled size={14} className="text-amber-500 shrink-0" />
          ),
          label: "Late",
        },
        absent: {
          icon: (
            <IconCircleXFilled size={14} className="text-red-500 shrink-0" />
          ),
          label: "Absent",
        },
        on_leave: {
          icon: <IconCalendar size={14} className="text-blue-500 shrink-0" />,
          label: "On Leave",
        },
      };

      const { icon, label } = styles[status];

      return (
        <span className="flex w-fit mx-auto justify-center items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-transparent dark:text-slate-300 animate-fade-in">
          {icon}
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "first_punch",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-center flex w-fit mx-auto hover:bg-transparent dark:text-slate-100 animate-fade-in"
      >
        Time in
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const rawTime = row.getValue("first_punch") as string;
      if (!rawTime)
        return (
          <span className="text-slate-400 text-xs flex w-fit mx-auto">—</span>
        );

      return (
        <div className="flex w-fit mx-auto items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium font-mono text-xs animate-fade-in">
          {formatRawTime(rawTime)}
        </div>
      );
    },
  },
  {
    accessorKey: "last_punch",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-center flex w-fit mx-auto hover:bg-transparent dark:text-slate-100 animate-fade-in"
      >
        Time out
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const rawTime = row.getValue("last_punch") as string;
      if (!rawTime)
        return (
          <span className="text-slate-400 text-xs flex w-fit mx-auto">—</span>
        );

      return (
        <div className="flex w-fit mx-auto items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium font-mono text-xs animate-fade-in">
          {formatRawTime(rawTime)}
        </div>
      );
    },
  },
  {
    accessorKey: "total_hours_worked",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-center flex w-fit mx-auto hover:bg-transparent dark:text-slate-100 animate-fade-in"
      >
        Hours Logged
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const decimalHours = row.getValue("total_hours_worked") as number;

      // Convert decimal hours to a human string (example: 8h 30m)
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);

      if (decimalHours === 0 || isNaN(decimalHours)) {
        return (
          <span className="text-slate-400 text-xs flex w-fit mx-auto animate-fade-in">
            0h 0m
          </span>
        );
      }

      return (
        <div className="flex w-fit mx-auto items-center gap-1.5 text-slate-900 dark:text-slate-100 font-semibold animate-fade-in">
          <span>
            {hours}h {minutes}m
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-slate-900 dark:text-slate-100 pr-4">
        Actions
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1 justify-center pr-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-md transition-colors"
            title="Edit Log"
          >
            <IconPencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-md transition-colors"
            title="Delete Log"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
