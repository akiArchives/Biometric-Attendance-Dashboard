"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeAttendanceCalendar } from "@/components/employee-attendance-calendar";
import { RawBiometricLog } from "@/utils/attendance-processor";

export interface EmployeeOption {
  employee_id: number;
  employee_name: string | null;
}

export interface CalendarViewProps {
  logs: RawBiometricLog[];
  userEmpId: number;
  isAdmin: boolean;
  employeesList?: EmployeeOption[];
  selectedEmployeeId: number;
  workStartTime: string;
  gracePeriod: number;
}

export function CalendarView({
  logs,
  userEmpId,
  isAdmin,
  employeesList = [],
  selectedEmployeeId,
  workStartTime,
  gracePeriod,
}: CalendarViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const todayObj = useMemo(() => new Date(), []);

  const dateParam = searchParams ? searchParams.get("date") : null;

  const { year, month } = useMemo(() => {
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      const [yStr, mStr] = dateParam.split("-");
      const y = parseInt(yStr, 10);
      const m = parseInt(mStr, 10);
      if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
        return { year: y, month: m };
      }
    }
    return { year: todayObj.getFullYear(), month: todayObj.getMonth() + 1 };
  }, [dateParam, todayObj]);

  const monthLabel = useMemo(() => {
    const d = new Date(year, month - 1, 1);
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  }, [year, month]);

  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear = year - 1;
    }
    const formattedDate = `${newYear}-${String(newMonth).padStart(2, "0")}-01`;
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("date", formattedDate);
    router.push(`?${params.toString()}`);
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear = year + 1;
    }
    const formattedDate = `${newYear}-${String(newMonth).padStart(2, "0")}-01`;
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("date", formattedDate);
    router.push(`?${params.toString()}`);
  };

  const handleToday = () => {
    const tYear = todayObj.getFullYear();
    const tMonth = todayObj.getMonth() + 1;
    const tDay = String(todayObj.getDate()).padStart(2, "0");
    const formattedDate = `${tYear}-${String(tMonth).padStart(2, "0")}-${tDay}`;
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("date", formattedDate);
    router.push(`?${params.toString()}`);
  };

  const handleEmployeeChange = (val: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("employee_id", val);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls & Navigation Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-card p-4 border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">{monthLabel}</h2>
            <p className="text-xs text-muted-foreground">Monthly attendance calendar view</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Admin Employee Picker */}
          {isAdmin && employeesList.length > 0 && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Select
                value={String(selectedEmployeeId)}
                onValueChange={handleEmployeeChange}
              >
                <SelectTrigger className="w-[200px] h-9 text-xs">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employeesList.map((emp) => (
                    <SelectItem
                      key={emp.employee_id}
                      value={String(emp.employee_id)}
                      className="text-xs"
                    >
                      {emp.employee_name || `Employee #${emp.employee_id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Month Navigation Controls */}
          <div className="flex items-center gap-1.5 border rounded-lg p-1 bg-muted/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="h-8 w-8 p-0"
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="h-8 px-2.5 text-xs font-medium"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0"
              aria-label="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Employee Attendance Calendar Component */}
      <EmployeeAttendanceCalendar
        logs={logs}
        employeeId={selectedEmployeeId}
        workStartTime={workStartTime}
        gracePeriod={gracePeriod}
        initialYear={year}
        initialMonth={month}
        hideMonthNavigation={true}
      />
    </div>
  );
}
