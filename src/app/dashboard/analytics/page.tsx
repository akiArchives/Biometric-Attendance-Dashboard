import { createClient } from "@/lib/supabase/server";
import { AttendanceTable } from "./attendance-table";
import {
  processDailyLogs,
  processUserHistoryLogs,
} from "@/utils/attendance-processor";
import { PersonnelAnalytics } from "./columns";

interface PageProps {
  searchParams: Promise<{ date?: string; status?: string }>;
}

export default async function AttendancePage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const dateParamProvided = Boolean(resolvedParams.date);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch self role and employee_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, employee_id")
    .eq("id", user?.id || "")
    .single();

  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const today = `${yyyy}-${mm}-${dd}`;
  const selectedDate = resolvedParams.date || today;

  let logsQuery = supabase
    .from("hik_biometric_logs")
    .select("*")
    .order("log_date_time", { ascending: true });

  let empQuery = supabase
    .from("employees")
    .select("employee_id, employee_name")
    .eq("is_active", true)
    .order("employee_name", { ascending: true })
    .neq("employee_id", 1111);

  if (profile?.role !== "admin") {
    const userEmpId = profile?.employee_id || 0;
    logsQuery = logsQuery.eq("employee_id", userEmpId);
    if (dateParamProvided) {
      logsQuery = logsQuery.eq("log_date", selectedDate);
    }
    empQuery = empQuery.eq("employee_id", userEmpId);
  } else {
    logsQuery = logsQuery.eq("log_date", selectedDate);
  }

  const [
    { data: rawLogs, error },
    { data: allEmployees, error: employeesError },
    { data: sysSettings, error: sysSettingsError },
  ] = await Promise.all([
    logsQuery,
    empQuery,
    supabase
      .from("system_settings")
      .select("work_start_time, grace_period")
      .eq("id", 1)
      .maybeSingle(),
  ]);

  if (error) {
    console.error(error);
    return (
      <div className="p-6 text-red-500">Error loading biometric data.</div>
    );
  }

  if (employeesError) {
    console.error("Employees fetch error:", employeesError);
  }

  if (sysSettingsError) {
    console.error("System settings fetch error:", sysSettingsError);
  }

  let workStartTime = "09:00";
  let gracePeriod = 15;
  if (sysSettings) {
    workStartTime = sysSettings.work_start_time;
    gracePeriod = sysSettings.grace_period;
  }

  const isAdmin = profile?.role === "admin";
  const isSingleUserView = !isAdmin;

  const currentEmp = (allEmployees || [])[0] || {
    employee_id: profile?.employee_id || 0,
    employee_name: null,
  };

  const userEmployee = isSingleUserView
    ? {
        employee_name: currentEmp.employee_name || "Employee",
        employee_id: String(currentEmp.employee_id),
      }
    : undefined;

  let processedData: PersonnelAnalytics[] = [];

  if (!isAdmin && !dateParamProvided) {
    processedData = processUserHistoryLogs(
      rawLogs || [],
      currentEmp,
      workStartTime,
      gracePeriod,
    );
  } else {
    processedData = processDailyLogs(
      rawLogs || [],
      allEmployees || [],
      workStartTime,
      gracePeriod,
    ).map((item) => ({ ...item, date: selectedDate }));
  }

  const statusParam = resolvedParams.status;
  const selectedStatuses = statusParam ? statusParam.split(",") : [];

  const filteredData =
    selectedStatuses.length > 0
      ? processedData.filter((item) => selectedStatuses.includes(item.status))
      : processedData;

  return (
    <div className="w-full h-auto mt-6 px-6">
      <AttendanceTable
        data={filteredData}
        isAdmin={isAdmin}
        isSingleUserView={isSingleUserView}
        userEmployee={userEmployee}
      />
    </div>
  );
}

