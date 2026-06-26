import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset>
        <Suspense fallback={
          <header className="flex h-17.25 shrink-0 items-center gap-2 border-b w-full bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14.25" />
        }>
          <SiteHeader />
        </Suspense>

        <div className="h-full overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
