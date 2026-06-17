"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Clock, Hourglass } from "lucide-react";

export type PersonnelAnalytics = {
  employee_id: string;
  employee_name: string;
  department_name?: string;
  first_punch: string | null; // First scan time of the day/period
  last_punch: string | null; // Latest scan time of the day/period
  total_hours_worked: number; // Calculated decimal or float (e.g., 8.25)
  is_currently_in: boolean; // Is the worker currently inside the building?
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
    accessorKey: "is_currently_in",
    header: "Presence Status",
    cell: ({ row }) => {
      const isIn = row.getValue("is_currently_in") as boolean;

      return isIn ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Clocked In
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Clocked Out
        </span>
      );
    },
  },
  {
    accessorKey: "first_punch",
    header: "First Punch",
    cell: ({ row }) => {
      const rawTime = row.getValue("first_punch") as string;
      if (!rawTime) return <span className="text-slate-400 text-xs">—</span>;

      return (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium font-mono text-xs">
          <Clock size={13} className="text-slate-400" />
          {new Date(rawTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "last_punch",
    header: "Last Punch",
    cell: ({ row }) => {
      const rawTime = row.getValue("last_punch") as string;
      if (!rawTime) return <span className="text-slate-400 text-xs">—</span>;

      return (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium font-mono text-xs">
          <Clock size={13} className="text-slate-400" />
          {new Date(rawTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "total_hours_worked",
    header: "Hours Logged",
    cell: ({ row }) => {
      const decimalHours = row.getValue("total_hours_worked") as number;

      // Convert decimal hours to a human string (example: 8h 30m)
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);

      if (decimalHours === 0 || isNaN(decimalHours)) {
        return <span className="text-slate-400 text-xs">0h 0m</span>;
      }

      return (
        <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
          <Hourglass size={14} className="" />
          <span>
            {hours}h {minutes}m
          </span>
        </div>
      );
    },
  },
];
