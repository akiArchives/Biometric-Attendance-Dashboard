"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Clock,
  Hourglass,
  CircleCheck,
  CircleX,
  Timer,
  CalendarDays,
} from "lucide-react";

// HikCentral stores local time but labels it +00:00. Slice the time directly
// from the ISO string to avoid any timezone conversion.
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
};

export const columns: ColumnDef<PersonnelAnalytics>[] = [
  {
    accessorKey: "employee_name",
    header: () => <span className="ml-2">Employee</span>,
    cell: ({ row }) => {
      const name = row.getValue("employee_name") as string;
      const empId = row.original.employee_id;
      const dept = row.original.department_name;

      return (
        <div className="flex items-center gap-3">
          <div>
            <div className="ml-2 font-semibold text-slate-900 capitalize">
              {name || "Unregistered Token"}
            </div>
            <div className="ml-2 text-xs text-slate-400 font-mono">
              ID: {empId} {dept && `• ${dept}`}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="justify-center flex w-fit mx-auto">Status</span>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as AttendanceStatus;

      const styles: Record<
        AttendanceStatus,
        { bg: string; icon: React.ReactNode; label: string }
      > = {
        present: {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-700",
          icon: <CircleCheck size={13} />,
          label: "Present",
        },
        late: {
          bg: "bg-amber-50 text-amber-700 border-amber-700",
          icon: <Timer size={13} />,
          label: "Late",
        },
        absent: {
          bg: "bg-red-50 text-red-600 border-red-700",
          icon: <CircleX size={13} />,
          label: "Absent",
        },
        on_leave: {
          bg: "bg-blue-50 text-blue-700 border-blue-700",
          icon: <CalendarDays size={13} />,
          label: "On Leave",
        },
      };

      const { bg, icon, label } = styles[status];

      return (
        <span
          className={`flex w-fit mx-auto justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg}`}
        >
          {icon}
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "first_punch",
    header: () => (
      <span className="justify-center flex w-fit mx-auto">Time in</span>
    ),
    cell: ({ row }) => {
      const rawTime = row.getValue("first_punch") as string;
      if (!rawTime)
        return (
          <span className="text-slate-400 text-xs flex w-fit mx-auto">—</span>
        );

      return (
        <div className="flex w-fit mx-auto items-center gap-1.5 text-slate-700 font-medium font-mono text-xs">
          <Clock size={13} className="text-slate-400" />
          {formatRawTime(rawTime)}
        </div>
      );
    },
  },
  {
    accessorKey: "last_punch",
    header: () => (
      <span className="justify-center flex w-fit mx-auto">Time out</span>
    ),
    cell: ({ row }) => {
      const rawTime = row.getValue("last_punch") as string;
      if (!rawTime)
        return (
          <span className="text-slate-400 text-xs flex w-fit mx-auto">—</span>
        );

      return (
        <div className="flex w-fit mx-auto items-center gap-1.5 text-slate-700 font-medium font-mono text-xs">
          <Clock size={13} className="text-slate-400" />
          {formatRawTime(rawTime)}
        </div>
      );
    },
  },
  {
    accessorKey: "total_hours_worked",
    header: () => (
      <span className="justify-center flex w-fit mx-auto">Hours Logged</span>
    ),
    cell: ({ row }) => {
      const decimalHours = row.getValue("total_hours_worked") as number;

      // Convert decimal hours to a human string (example: 8h 30m)
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);

      if (decimalHours === 0 || isNaN(decimalHours)) {
        return (
          <span className="text-slate-400 text-xs flex w-fit mx-auto">
            0h 0m
          </span>
        );
      }

      return (
        <div className="flex w-fit mx-auto items-center gap-1.5 text-slate-900 font-semibold">
          <Hourglass size={14} className="" />
          <span>
            {hours}h {minutes}m
          </span>
        </div>
      );
    },
  },
];
