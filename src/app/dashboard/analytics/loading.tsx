import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardAction, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="w-full h-auto my-4 px-4">
      <div className="flex flex-col gap-4">
        {/* Desktop View Table Skeleton */}
        <div className="hidden md:block relative w-full overflow-x-auto rounded-md border bg-card text-card-foreground shadow-md">
          <Table noWrapper className="table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-blue-100 shadow-sm">
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
                <TableRow key={i} className="odd:bg-gray-100">
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

        {/* Mobile View Cards Skeleton */}
        <div className="md:hidden flex flex-col gap-3 pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="shadow-sm bg-card mb-2">
              <CardHeader className="">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <CardAction className="">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </CardAction>
              </CardHeader>
              <Separator className="" />
              <CardContent className="-mx-6 -my-1">
                <div className="grid grid-cols-3 text-xs">
                  <div className="flex flex-col gap-1 items-center text-center rounded-lg bg-muted/20">
                    <span className="text-muted-foreground font-medium">Time In</span>
                    <Skeleton className="h-4 w-16 mt-1" />
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center rounded-lg bg-muted/20">
                    <span className="text-muted-foreground font-medium">Time Out</span>
                    <Skeleton className="h-4 w-16 mt-1" />
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center rounded-lg bg-muted/20">
                    <span className="text-muted-foreground font-medium">Logged</span>
                    <Skeleton className="h-4 w-14 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
