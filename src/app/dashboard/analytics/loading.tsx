import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="w-full my-4 px-4">
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-md border bg-card text-card-foreground">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="bg-blue-50 h-4 w-28 ml-2" />
                </TableHead>
                <TableHead>
                  <Skeleton className="bg-blue-50 h-4 w-16 flex mx-auto" />
                </TableHead>
                <TableHead>
                  <Skeleton className="bg-blue-50 h-4 w-16 flex mx-auto" />
                </TableHead>
                <TableHead>
                  <Skeleton className="bg-blue-50 h-4 w-16 flex mx-auto" />
                </TableHead>
                <TableHead>
                  <Skeleton className="bg-blue-50 h-4 w-24 flex mx-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 13 }).map((_, i) => (
                <TableRow key={i} className="">
                  <TableCell className="h-13.25">
                    <div className="flex flex-col gap-1 ml-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full flex mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 flex mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 flex mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-14 flex mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
