import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="w-full h-full p-4 flex flex-col gap-5">
      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-6 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        {/* Present Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-700 gap-2">
              Present
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-12 mt-1" />
            </CardTitle>
            <CardAction>
              <Skeleton className="h-13 w-13 rounded-md" />
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Skeleton className="h-5 w-24" />
          </CardFooter>
        </Card>

        {/* Late Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-700 gap-2">
              Late
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-12 mt-1" />
            </CardTitle>
            <CardAction>
              <Skeleton className="h-13 w-13 rounded-md" />
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Skeleton className="h-5 w-24" />
          </CardFooter>
        </Card>

        {/* Absent Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-700 gap-2">
              Absent
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-12 mt-1" />
            </CardTitle>
            <CardAction>
              <Skeleton className="h-13 w-13 rounded-md" />
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Skeleton className="h-5 w-24" />
          </CardFooter>
        </Card>

        {/* Total Employees Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center text-gray-700 gap-2">
              Total Employees
            </CardDescription>
            <CardTitle className="text-2xl font-semibold text-gray-700 tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-12 mt-1" />
            </CardTitle>
            <CardAction>
              <Skeleton className="h-13 w-13 rounded-md" />
            </CardAction>
          </CardHeader>
          <CardFooter className="py-1.5 justify-center">
            <Skeleton className="h-5 w-24" />
          </CardFooter>
        </Card>
      </div>

      {/* Bottom Section: Chart & Recent Logs */}
      <div className="flex flex-row w-full h-fit rounded-xl gap-6">
        {/* Chart Skeleton */}
        <Card className="shadow-md w-full">
          <CardHeader className="text-gray-600">
            <CardTitle className="text-sm font-medium flex items-center gap-2 whitespace-nowrap">
              Weekly Attendance Metrics
            </CardTitle>
            <CardAction>
              <Skeleton className="h-9 w-32 rounded-md" />
            </CardAction>
          </CardHeader>
          <CardContent className="">
            <div className="aspect-auto h-[calc(100vh-350px)] w-full flex items-end justify-between gap-6 pt-12 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                >
                  <Skeleton
                    className="w-full rounded-t-md max-w-16"
                    style={{ height: `${30 + (i % 3) * 20}%` }}
                  />
                  <Skeleton className="mb-5 h-3 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Logs Skeleton */}
        <Card className="flex flex-col w-[380px] h-fit shadow-md overflow-visible">
          <CardHeader className="text-gray-600">
            <CardTitle className="text-sm font-medium flex items-center gap-2 whitespace-nowrap">
              Recent Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="rounded-none flex-1 px-3 whitespace-nowrap">
            <div className="divide-y rounded-none divide-gray-100 dark:divide-slate-800">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="py-2 flex items-center justify-between px-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-28" />
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
