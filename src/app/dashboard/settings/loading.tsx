import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Page Header Skeleton */}
      <div className="space-y-1.5 border-b pb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="space-y-6">
        {/* Section 1: Account Profile */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-10 w-full sm:w-64 rounded-md" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-10 w-full sm:w-64 rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Preferences */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-52" />
              </div>
              <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-60" />
              </div>
              <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Work Shift & Grace Period Rules */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-10 w-full sm:w-36 rounded-md" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-10 w-full sm:w-36 rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Workspace Members */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-border/40"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-9 w-28 rounded-md" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button Bar */}
        <div className="flex justify-end pt-2">
          <Skeleton className="h-11 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
