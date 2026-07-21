import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="w-full h-full p-4 md:p-6 flex flex-col gap-6 animate-fade-in">
      {/* Top Header & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>

      {/* 4 Summary Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="size-11 rounded-xl" />
            </CardHeader>
            <CardFooter className="pt-2">
              <Skeleton className="h-3 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Main Content: Chart/Duty Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics / Duty Panel Skeleton */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full h-64 md:h-80 flex items-end justify-between gap-4 pt-8 pb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-3 h-full justify-end"
                >
                  <Skeleton
                    className="w-full rounded-t-md max-w-16"
                    style={{ height: `${35 + ((i * 17) % 55)}%` }}
                  />
                  <Skeleton className="h-3 w-10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel: Recent Logs Skeleton */}
        <Card className="shadow-md flex flex-col">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-border/40"
              >
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="space-y-1.5 text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-3 w-12 ml-auto" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
