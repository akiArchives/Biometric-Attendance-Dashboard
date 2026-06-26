import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

export default function Loading() {
  const selectedDate = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full w-full my-4 px-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
}
