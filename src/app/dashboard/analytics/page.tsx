import { createClient } from "@/lib/supabase/server";
import { AttendanceTable } from "./attendance-table";
import { processDailyLogs } from "@/utils/attendance-processor";

interface PageProps {
  searchParams: Promise<{ date?: string; status?: string }>;
}

export default async function AttendancePage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const today = `${yyyy}-${mm}-${dd}`;
  const selectedDate = resolvedParams.date || today;

  const [
    { data: rawLogs, error },
    { data: allEmployees, error: employeesError },
    { data: sysSettings, error: sysSettingsError }
  ] = await Promise.all([
    supabase
      .from("hik_biometric_logs")
      .select("*")
      .eq("log_date", selectedDate)
      .order("log_date_time", { ascending: true }),
    supabase
      .from("employees")
      .select("employee_id, employee_name")
      .eq("is_active", true)
      .order("employee_name", { ascending: true })
      .neq("employee_id", 1111),
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

  const processedData = processDailyLogs(
    rawLogs || [],
    allEmployees || [],
    workStartTime,
    gracePeriod,
  );

  const statusParam = resolvedParams.status;
  const selectedStatuses = statusParam ? statusParam.split(",") : [];

  const filteredData = selectedStatuses.length > 0
    ? processedData.filter((item) => selectedStatuses.includes(item.status))
    : processedData;

  return (
    <div className="w-full h-auto mt-6 px-6">
      <AttendanceTable data={filteredData} />
    </div>
  );
}
