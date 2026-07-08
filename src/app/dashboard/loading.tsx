import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck2, ClockAlert, UserRoundX, Users } from "lucide-react";
import {
  Card,
  CardDescription,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="w-full h-full p-6 flex flex-col gap-5">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 *:data-[slot=card]:shadow-xs lg:grid-cols-4">
        {/* Present Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
              Present
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-12 mt-1" />
            </CardTitle>
            <CardAction>
              <div className="flex h-13 w-13 items-center justify-center rounded-md bg-emerald-100/80 text-emerald-600 border-3 border-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-400/30">
                <CalendarCheck2 className="size-9" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Skeleton className="h-5 w-24" />
          </CardFooter>
        </Card>

        {/* Late Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
              Late
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-12 mt-1" />
            </CardTitle>
            <CardAction>
              <div className="flex h-13 w-13 items-center justify-center rounded-md bg-yellow-100/80 text-yellow-600 border-3 border-yellow-600/20 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-400/30">
                <ClockAlert className="size-9" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Skeleton className="h-5 w-24" />
          </CardFooter>
        </Card>

        {/* Absent Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
              Absent
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-12 mt-1" />
            </CardTitle>
            <CardAction>
              <div className="flex h-13 w-13 items-center justify-center rounded-md bg-red-100/80 text-red-600 border-3 border-red-600/20 dark:bg-red-950/40 dark:text-red-400 dark:border-red-400/30">
                <UserRoundX className="size-9" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Skeleton className="h-5 w-24" />
          </CardFooter>
        </Card>

        {/* Total Employees Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
              Total Employees
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-12 mt-1" />
            </CardTitle>
            <CardAction>
              <div className="flex h-13 w-13 items-center justify-center rounded-md bg-indigo-100/80 text-indigo-600 border-3 border-indigo-600/20 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-400/30">
                <Users className="size-9" />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Skeleton className="h-5 w-24" />
          </CardFooter>
        </Card>
      </div>

      {/* Bottom Section: Chart & Recent Logs */}
      <div className="flex flex-col lg:flex-row items-start w-full h-fit rounded-xl gap-4 lg:gap-6">
        {/* Chart Skeleton */}
        <Card className="shadow-md w-full lg:flex-1">
          <CardHeader className="text-gray-600 dark:text-gray-300">
            <CardTitle className="text-sm font-medium flex items-center gap-2 whitespace-nowrap">
              Weekly Attendance Metrics
            </CardTitle>
            <CardAction>
              <Skeleton className="h-9 w-32 rounded-md" />
            </CardAction>
          </CardHeader>
          <CardContent className="">
            <div className="w-full aspect-video md:aspect-2/1 max-h-99 flex items-end justify-between gap-6 pt-12 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-3 h-full justify-end"
                >
                  <Skeleton
                    className="w-full rounded-t-md max-w-45"
                    style={{ height: `${30 + (i % 3) * 20}%` }}
                  />
                  <Skeleton className="mb-5 h-3 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Logs Skeleton */}
        <Card className="flex flex-col w-full lg:w-95 h-fit shadow-md overflow-visible mb-4">
          <CardHeader className="text-gray-600 dark:text-gray-300">
            <CardTitle className="text-sm font-medium flex items-center gap-2 whitespace-nowrap">
              Recent Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="rounded-none flex-1 px-3 whitespace-nowrap">
            <div className="rounded-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="py-2.5 flex items-center justify-between px-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-4 w-16 ml-auto" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
