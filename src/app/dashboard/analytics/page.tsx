import { createClient } from "@/lib/supabase/server";
import { AttendanceTable } from "./attendance-table";
import { processDailyLogs } from "@/utils/attendance-processor";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
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

  const [{ data: rawLogs, error }, { data: allEmployees }] = await Promise.all([
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
  ]);

  if (error) {
    console.error(error);
    return (
      <div className="p-6 text-red-500">Error loading biometric data.</div>
    );
  }

  const processedData = processDailyLogs(
    rawLogs || [],
    allEmployees || [],
  );

  return (
    <div className="w-full h-auto my-4 px-4">
      <AttendanceTable data={processedData} />
    </div>
  );
}
