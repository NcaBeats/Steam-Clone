import Link from "next/link";
import { Erica_One } from "next/font/google";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminBurgerMenu } from "@/components/admin/AdminBurgerMenu";
import { requireRole } from "@/actions/admin/guard";

const ericaOne = Erica_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-erica-one",
});

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
            <span className={`text-2xl text-white ${ericaOne.className}`}>
              MBR
            </span>
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
