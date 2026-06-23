import { createClient } from "@/utils/supabase/server";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { processDailyLogs } from "@/utils/attendance-processor";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";

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
      .from("hik_biometric_logs")
      .select("employee_id, employee_name")
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
    <div className="w-full my-5 px-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="ml-3 flex flex-row items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-700">
            Daily Attendance
          </h1>

          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />

          <p className="text-sm text-slate-500">
            {isToday
              ? "Showing today's logs"
              : `Viewing logs for ${selectedDate}`}
          </p>
        </div>
        <DatePicker selected={selectedDate} />
      </div>

      <DataTable columns={columns} data={processedData} />
    </div>
  );
}
