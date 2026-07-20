import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck2,
  Clock,
  ClockAlert,
  UserCheck,
  LogIn,
  LogOut,
  Fingerprint,
} from "lucide-react";
import { EmployeeMonthlyStats, RawBiometricLog } from "@/utils/attendance-processor";

export interface EmployeeDashboardViewProps {
  stats: EmployeeMonthlyStats;
  recentLogs: RawBiometricLog[];
  userEmployee: { employee_name: string; employee_id: number };
}

function formatTime12h(timeStr: string | null): string {
  if (!timeStr) return "—";
  let timePart = timeStr;
  if (timeStr.includes("T")) {
    timePart = timeStr.substring(11, 19);
  }
  const parts = timePart.split(":");
  if (parts.length < 2) return timeStr;
  const h = parseInt(parts[0], 10);
  const m = parts[1];
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${m} ${ampm}`;
}

function formatDateDisplay(dateStr: string | null, dateTimeStr: string | null): string {
  if (dateStr) return dateStr;
  if (dateTimeStr && dateTimeStr.includes("T")) return dateTimeStr.substring(0, 10);
  return "—";
}

export function EmployeeDashboardView({
  stats,
  recentLogs,
  userEmployee,
}: EmployeeDashboardViewProps) {
  const loggedHoursProgress = Math.min(
    100,
    Math.max(0, (stats.loggedHoursThisWeek / 40.0) * 100)
  );

  const renderTodayStatusBadge = () => {
    switch (stats.todayStatus.state) {
      case "checked_in":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800">
            On Duty
          </Badge>
        );
      case "checked_out":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-300 dark:border-blue-800">
            Shift Complete
          </Badge>
        );
      case "not_scanned":
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 dark:border-amber-800">
            Not Checked In
          </Badge>
        );
    }
  };

  const renderTodayStatusHeadline = () => {
    switch (stats.todayStatus.state) {
      case "checked_in":
        return `Checked In at ${formatTime12h(stats.todayStatus.firstPunch)}`;
      case "checked_out":
        return `Checked Out at ${formatTime12h(stats.todayStatus.lastPunch)}`;
      case "not_scanned":
      default:
        return "No Scan Recorded Today";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header Card / Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border bg-card text-card-foreground shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg border border-primary/20 shrink-0">
            {userEmployee.employee_name
              ? userEmployee.employee_name.charAt(0).toUpperCase()
              : "E"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                {userEmployee.employee_name}
              </h1>
              <Badge variant="outline" className="text-xs font-mono">
                ID: {userEmployee.employee_id}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Employee Dashboard & Personal Logs
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-medium gap-1.5 border">
            <UserCheck className="size-3.5 text-primary" />
            Personal Attendance Dashboard
          </Badge>
        </div>
      </div>

      {/* 2. 4 Personal Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Card 1: Monthly On-Time Rate */}
        <Card className="@container/card shadow-xs">
          <CardHeader>
            <CardDescription className="flex items-center text-muted-foreground gap-2">
              Monthly On-Time Rate
            </CardDescription>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                {stats.onTimeRatePercent}%
              </CardTitle>
              <Badge
                className={
                  stats.onTimeRatePercent >= 90
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                }
              >
                {stats.onTimeRatePercent >= 90 ? "Excellent" : "Needs Imp."}
              </Badge>
            </div>
            <CardAction>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-100/80 text-emerald-600 border border-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-400/30">
                <CalendarCheck2 className="size-7" />
              </div>
            </CardAction>
          </CardHeader>
        </Card>

        {/* Card 2: Logged Hours This Week */}
        <Card className="@container/card shadow-xs">
          <CardHeader>
            <CardDescription className="flex items-center text-muted-foreground gap-2">
              Logged Hours This Week
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl mt-1">
              {stats.loggedHoursThisWeek.toFixed(1)} / 40.0 hrs
            </CardTitle>
            <CardAction>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100/80 text-blue-600 border border-blue-600/20 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-400/30">
                <Clock className="size-7" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loggedHoursProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Late Arrivals */}
        <Card className="@container/card shadow-xs">
          <CardHeader>
            <CardDescription className="flex items-center text-muted-foreground gap-2">
              Late Arrivals
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl mt-1">
              {stats.lateCount} {stats.lateCount === 1 ? "time" : "times"}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              avg {stats.avgLateMins} mins late
            </p>
            <CardAction>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-amber-100/80 text-amber-600 border border-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-400/30">
                <ClockAlert className="size-7" />
              </div>
            </CardAction>
          </CardHeader>
        </Card>

        {/* Card 4: Days Present */}
        <Card className="@container/card shadow-xs">
          <CardHeader>
            <CardDescription className="flex items-center text-muted-foreground gap-2">
              Days Present
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl mt-1">
              {stats.presentDaysCount} / {stats.elapsedWorkdaysCount} days
            </CardTitle>
            <CardAction>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100/80 text-indigo-600 border border-indigo-600/20 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-400/30">
                <UserCheck className="size-7" />
              </div>
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      {/* 3. Lower Section (2 columns on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Column 1: Today's Shift Status */}
        <Card className="shadow-xs">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Today's Shift Status
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time status based on biometric scans
                </CardDescription>
              </div>
              {renderTodayStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 p-4 rounded-lg bg-muted/50 border flex items-center justify-between">
              <span className="text-base font-semibold text-foreground">
                {renderTodayStatusHeadline()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-md border bg-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
                  <LogIn className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Time In</p>
                  <p className="text-sm font-semibold text-foreground font-mono">
                    {formatTime12h(stats.todayStatus.firstPunch)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-md border bg-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 shrink-0">
                  <LogOut className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Time Out</p>
                  <p className="text-sm font-semibold text-foreground font-mono">
                    {formatTime12h(stats.todayStatus.lastPunch)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Column 2: Recent Personal Biometric Scans */}
        <Card className="shadow-xs">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Fingerprint className="size-4 text-primary" />
              Recent Personal Biometric Scans
            </CardTitle>
            <CardDescription className="text-xs">
              Timeline of recent device logs
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {recentLogs && recentLogs.length > 0 ? (
              <div className="divide-y">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="py-3 flex items-center justify-between hover:bg-muted/40 px-2 rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Fingerprint className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Scan Recorded
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          ID #{log.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground font-mono">
                        {log.log_time ? formatTime12h(log.log_time) : formatTime12h(log.log_date_time)}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {formatDateDisplay(log.log_date, log.log_date_time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Fingerprint className="size-10 stroke-1 mb-2 opacity-50" />
                <p className="text-sm">No recent biometric scans found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
