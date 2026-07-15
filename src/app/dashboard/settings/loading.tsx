export default function SettingsLoading() {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10 bg-background min-h-full">
      <div className="space-y-8">
        {/* ACCOUNT PROFILE SKELETON */}
        <div className="space-y-5 border-b pb-8">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg pb-2">
            <div className="h-6 w-36 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-border/10 pb-4 gap-3">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-64 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-9 w-48 bg-muted rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* PREFERENCES SKELETON */}
        <div className="space-y-5 border-b pb-8">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg pb-2">
            <div className="h-6 w-28 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/10 pb-4 gap-3">
              <div className="space-y-2">
                <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                <div className="h-3 w-72 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-9 w-36 bg-muted rounded-md animate-pulse" />
            </div>
            <div className="flex items-center justify-between pb-2 gap-3">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-64 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-9 w-36 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </div>

        {/* SHIFT RULES SKELETON */}
        <div className="space-y-5 border-b pb-8">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg pb-2">
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/10 pb-4 gap-3">
              <div className="space-y-2">
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                <div className="h-3 w-64 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-9 w-36 bg-muted rounded-md animate-pulse" />
            </div>
            <div className="flex items-center justify-between pb-2 gap-3">
              <div className="space-y-2">
                <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                <div className="h-3 w-64 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-9 w-36 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON SKELETON */}
        <div className="flex justify-end pt-2">
          <div className="h-11 w-32 bg-muted rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
