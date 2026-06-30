import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ChartBarStacked } from "@/components/chart-bar-stacked";
import {
  CalendarCheck2,
  UserRoundX,
  ClockAlert,
  Users,
  ArrowRight,
  Fingerprint,
} from "lucide-react";
import { processDailyLogs } from "@/utils/attendance-processor";
import Link from "next/link";

function formatTime12h(timeStr: string): string {
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  const h = parseInt(parts[0], 10);
  const m = parts[1];
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${m} ${ampm}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Calculate Monday of the current week based on today's date
  const [year, month, day] = today.split("-").map(Number);
  const todayDate = new Date(year, month - 1, day, 12, 0, 0);
  const dayOfWeek = todayDate.getDay(); // 0 = Sunday, 1 = Monday, ...

  const monday = new Date(todayDate);
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(todayDate.getDate() + diffToMonday);

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const weekDates = weekDays.map((_, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);

    // Format as YYYY-MM-DD
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dayVal = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dayVal}`;
  });

  // Format week range label (e.g. "June 22 - 26")
  const formatLabelDate = (dString: string) => {
    const [y, m, d] = dString.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d, 12, 0, 0);
    const monthName = dateObj.toLocaleDateString("en-US", { month: "long" });
    return { month: monthName, day: dateObj.getDate() };
  };

  const startLabel = formatLabelDate(weekDates[0]);
  const endLabel = formatLabelDate(weekDates[4]);

  let weekRangeLabel = "";
  if (startLabel.month === endLabel.month) {
    weekRangeLabel = `${startLabel.month} ${startLabel.day} - ${endLabel.day}`;
  } else {
    weekRangeLabel = `${startLabel.month} ${startLabel.day} - ${endLabel.month} ${endLabel.day}`;
  }

  let allEmployees: any[] = [];
  let weeklyLogs: any[] = [];
  let errorMsg = "";

  try {
    const [empRes, logsRes] = await Promise.all([
      supabase
        .from("employees")
        .select("employee_id, employee_name")
        .eq("is_active", true)
        .order("employee_name", { ascending: true }),
      supabase
        .from("hik_biometric_logs")
        .select("*")
        .gte("log_date", weekDates[0])
        .lte("log_date", weekDates[4])
        .order("log_date_time", { ascending: true }),
    ]);

    if (empRes.error) {
      console.error("Employees fetch error:", empRes.error);
      errorMsg = "Error loading employee data.";
    } else {
      allEmployees = empRes.data || [];
    }

    if (logsRes.error) {
      console.error("Weekly logs fetch error:", logsRes.error);
      errorMsg = "Error loading attendance logs.";
    } else {
      weeklyLogs = logsRes.data || [];
    }
  } catch (err) {
    console.error("Unexpected fetch exception:", err);
    errorMsg = "An unexpected error occurred while fetching data.";
  }

  // Filter today's raw logs from the weekly logs in-memory
  const rawLogs = weeklyLogs.filter((log) => log.log_date === today);

  // Recent logs (today's logs, sorted descending, limit 5)
  const recentLogs = [...rawLogs].reverse().slice(0, 6);

  // Process today's attendance logs
  const processedData = processDailyLogs(rawLogs, allEmployees, true);

  // Process weekly chart data dynamically
  const chartData = weekDays.map((dayName, index) => {
    const dateStr = weekDates[index];
    const dailyLogs = weeklyLogs.filter((log) => log.log_date === dateStr);
    const processed = processDailyLogs(dailyLogs, allEmployees);

    const present = processed.filter((emp) => emp.status === "present").length;
    const late = processed.filter((emp) => emp.status === "late").length;

    return {
      day: dayName,
      present,
      late,
    };
  });

  const presentCount = processedData.filter(
    (emp) => emp.status === "present",
  ).length;
  const lateCount = processedData.filter((emp) => emp.status === "late").length;
  const absentCount = processedData.filter(
    (emp) => emp.status === "absent",
  ).length;
  const totalCount = allEmployees.length;

  return (
    <div className="w-full h-full p-4 flex flex-col gap-5">
      {/*Cards*/}
      <div className="grid grid-cols-4 gap-6 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-700 gap-2">
              Present
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              {presentCount}
            </CardTitle>
            <CardAction>
              <div className="flex h-13 w-13 items-center justify-center rounded-md bg-emerald-100/80 text-emerald-600">
                <CalendarCheck2 className="size-9" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Link href="/dashboard/analytics?status=present">
              <Button
                variant="link"
                className="h-auto p-0 text-xs gap-1 text-muted-foreground hover:text-primary hover:no-underline group"
              >
                View details
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-700 gap-2">
              Late
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              {lateCount}
            </CardTitle>
            <CardAction>
              <div className="flex h-13 w-13 items-center justify-center rounded-md bg-yellow-100/80 text-yellow-600">
                <ClockAlert className="size-9" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Link href="/dashboard/analytics?status=late">
              <Button
                variant="link"
                className="h-auto p-0 text-xs gap-1 text-muted-foreground hover:text-primary hover:no-underline group"
              >
                View details
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-700 gap-2">
              Absent
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              {absentCount}
            </CardTitle>
            <CardAction>
              <div className="flex h-13 w-13 items-center justify-center rounded-md bg-red-100/80 text-red-600">
                <UserRoundX className="size-9" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Link href="/dashboard/analytics?status=absent">
              <Button
                variant="link"
                className="h-auto p-0 text-xs gap-1 text-muted-foreground hover:text-primary hover:no-underline group"
              >
                View details
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-700 gap-2">
              Total Employees
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              {totalCount}
            </CardTitle>
            <CardAction>
              <div className="flex h-13 w-13 items-center justify-center rounded-md bg-indigo-100/80 text-indigo-600">
                <Users className="size-9" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Link href="/dashboard/analytics">
              <Button
                variant="link"
                className="h-auto p-0 text-xs gap-1 text-muted-foreground hover:text-primary hover:no-underline group"
              >
                View details
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* BIG CARD - RECENT LOGS */}

      <div className="flex flex-row w-full h-fit rounded-xl gap-6">
        {/* CHART BAR */}
        <ChartBarStacked data={chartData} weekRange={weekRangeLabel} />

        {/* RECENT LOGS */}
        <Card className="flex flex-col w-[380px] h-fit shadow-md overflow-visible">
          <CardHeader className="text-gray-600">
            <CardTitle className="text-sm font-medium flex items-center gap-2 whitespace-nowrap">
              Recent Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="rounded-none flex-1 px-3 whitespace-nowrap">
            {recentLogs.length > 0 ? (
              <div className="divide-y rounded-none divide-gray-100 dark:divide-slate-800">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="py-2 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {log.employee_name || "Unregistered Token"}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          ID: {log.employee_id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {log.log_time ? formatTime12h(log.log_time) : "—"}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        {log.log_date || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-50 text-slate-400">
                <p className="text-sm">No recent logs found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
