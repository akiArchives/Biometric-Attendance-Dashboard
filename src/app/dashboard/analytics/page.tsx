import { createClient } from "@/utils/supabase/server";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { processDailyLogs } from "@/utils/attendance-processor";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function AttendancePage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  const today = new Date().toISOString().split("T")[0];
  const selectedDate = resolvedParams.date || today;
  const isToday = selectedDate === today;

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
      .order("employee_name", { ascending: true }),
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
    isToday,
  );

  return (
    <div className="w-full my-4 px-4">
      <DataTable columns={columns} data={processedData} />
    </div>
  );
}
