import { createClient } from "@/lib/supabase/server";
import {
  processDailyLogs,
  RawBiometricLog,
  EmployeeStub,
} from "@/utils/attendance-processor";
import { RedirectToDefaultHome } from "@/components/redirect-to-default-home";
import { AdminDashboardView } from "@/components/admin-dashboard-view";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const localToday = `${yyyy}-${mm}-${dd}`;

  const today =
    date && /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date))
      ? date
      : localToday;

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

  let allEmployees: EmployeeStub[] = [];
  let weeklyLogs: RawBiometricLog[] = [];
  let workStartTime = "09:00";
  let gracePeriod = 15;
  let errorMsg = "";

  // Fetch self role and employee_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, employee_id")
    .eq("id", user?.id || "")
    .single();

  let empQuery = supabase
    .from("employees")
    .select("employee_id, employee_name")
    .eq("is_active", true)
    .order("employee_name", { ascending: true })
    .neq("employee_id", 1111);

  let logsQuery = supabase
    .from("hik_biometric_logs")
    .select("*")
    .gte("log_date", weekDates[0])
    .lte("log_date", weekDates[4])
    .order("log_date_time", { ascending: true });

  if (profile?.role !== "admin") {
    const userEmpId = profile?.employee_id || 0;
    empQuery = empQuery.eq("employee_id", userEmpId);
    logsQuery = logsQuery.eq("employee_id", userEmpId);
  }

  try {
    const [empRes, logsRes, sysSettingsRes] = await Promise.all([
      empQuery,
      logsQuery,
      supabase
        .from("system_settings")
        .select("work_start_time, grace_period")
        .eq("id", 1)
        .maybeSingle(),
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

    if (sysSettingsRes.error) {
      console.error("System settings fetch error:", sysSettingsRes.error);
    } else if (sysSettingsRes.data) {
      workStartTime = sysSettingsRes.data.work_start_time;
      gracePeriod = sysSettingsRes.data.grace_period;
    }
  } catch (err) {
    console.error("Unexpected fetch exception:", err);
    errorMsg = "An unexpected error occurred while fetching data.";
  }

  if (errorMsg) {
    return <div className="p-6 text-red-500 font-medium">{errorMsg}</div>;
  }

  // Filter today's raw logs from the weekly logs in-memory
  const rawLogs = weeklyLogs.filter((log) => log.log_date === today);

  // Recent logs (today's logs, sorted descending, limit 5)
  const recentLogs = [...rawLogs].reverse().slice(0, 5);

  // Process today's attendance logs
  const processedData = processDailyLogs(rawLogs, allEmployees, workStartTime, gracePeriod);

  // Process weekly chart data dynamically
  const chartData = weekDays.map((dayName, index) => {
    const dateStr = weekDates[index];
    const dailyLogs = weeklyLogs.filter((log) => log.log_date === dateStr);
    const processed = processDailyLogs(dailyLogs, allEmployees, workStartTime, gracePeriod);

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
    <div className="w-full h-full p-6 flex flex-col gap-5">
      <RedirectToDefaultHome userId={user?.id || ""} />
      <AdminDashboardView
        presentCount={presentCount}
        lateCount={lateCount}
        absentCount={absentCount}
        totalCount={totalCount}
        chartData={chartData}
        weekRangeLabel={weekRangeLabel}
        today={today}
        recentLogs={recentLogs}
      />
    </div>
  );
}
