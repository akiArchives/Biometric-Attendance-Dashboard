import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { user } = session;

  const sidebarUser = {
    name: user.name || user.nickname || user.email?.split("@")[0] || "User",
    email: user.email || "",
    avatar: user.picture || "",
  };

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar user={sidebarUser} />
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
