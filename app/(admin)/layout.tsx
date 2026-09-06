import Image from "next/image";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminBurgerMenu } from "@/components/admin/AdminBurgerMenu";
import { requireRole } from "@/actions/admin/guard";

export default async function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  await requireRole(["ADMIN"], "/studio/games");

  return (
    <div className="flex min-h-screen bg-[#18181C]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="sm:hidden bg-[#0A0A0A] border-b border-[#2A2A2A] h-16 flex items-center justify-between px-4">
          <AdminBurgerMenu />
          <Link href="/" className="flex items-center">
            <Image
              src="Logo.svg"
              width={128}
              height={128}
              alt="Steam Logo"
              className="w-auto h-8"
            />
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
