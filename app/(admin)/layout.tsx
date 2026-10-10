import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/dashboard/app-sidebar";
import { SiteHeader } from "@/components/admin/dashboard/site-header";
import { requireRole } from "@/actions/admin/guard";
import { getCurrentUserAction } from "@/actions/admin/auth";

export default async function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  await requireRole(["ADMIN"], "/studio/games");
  const user = await getCurrentUserAction();

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          variant="admin"
          user={{ email: user?.email ?? "", role: user?.role ?? "" }}
        />
        <SidebarInset>
          <SiteHeader title="Dashboard" />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
