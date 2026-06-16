import { analyticsData } from "@/lib/data";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function AnalyticsPage() {
  return (
    <div className="container mx-auto py-auto">
      <h1 className="text-2xl ml-2 font-semibold pb-3">Today</h1>
      <DataTable columns={columns} data={analyticsData} />
    </div>
  );
}
