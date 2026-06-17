import { createClient } from "@/utils/supabase/server";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { processBiometricLogs } from "@/utils/attendance-processor";

export const revalidate = 0;

export default async function AttendancePage() {
  const supabase = await createClient();

  const { data: rawLogs, error } = await supabase
    .from("hik_biometric_logs")
    .select("*");

  if (error) {
    console.error("Database retrieval error:", error);
    return (
      <div className="p-6 text-red-500">Failed to load biometric events.</div>
    );
  }

  // Map database entries to matches for PersonnelAnalytics columns
  const processedData = processBiometricLogs(rawLogs || []);

  return (
    <div className="container px-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Personnel Presence
        </h1>
      </div>

      <DataTable columns={columns} data={processedData} />
    </div>
  );
}
