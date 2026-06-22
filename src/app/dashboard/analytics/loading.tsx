import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

export default function Loading() {
  const selectedDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto px-4">
      <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daily Attendance
          </h1>

          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />

          <p className="text-sm text-slate-500">Fetching today{`'`}s logs...</p>
        </div>
        <DatePicker selected={selectedDate} />
      </div>

      <DataTable columns={[]} data={[]} />
    </div>
  );
}
