import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-linear-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 font-sans px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-700 dark:text-zinc-50">
            Attendance Dashboard
          </h1>
          {/* <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Welcome to the attendance tracking and analytics system. Click below to view the analytics dashboard.
          </p> */}
        </div>
        <Button
          asChild
          size="lg"
          className="w-full bg-indigo-600 justify-center gap-2 font-medium cursor-pointer"
        >
          <Link href="/dashboard/">
            Go to Dashboard
            <ArrowRight className="size-4 group-hover/button:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
