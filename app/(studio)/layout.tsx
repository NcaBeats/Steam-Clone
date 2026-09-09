import Link from "next/link";
import { Erica_One } from "next/font/google";
import { StudioSidebar } from "@/components/studio/StudioSidebar";
import { StudioBurgerMenu } from "@/components/studio/StudioBurgerMenu";
import { requireRole } from "@/actions/admin/guard";

const ericaOne = Erica_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-erica-one",
});

export default async function StudioLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  await requireRole(["VENDEDOR"], "/admin");

  return (
    <div className="flex min-h-screen bg-[#18181C]">
      <StudioSidebar />
      <div className="flex-1 flex flex-col">
        <header className="sm:hidden bg-[#18181C] border-b border-white/[0.06] h-16 flex items-center justify-between px-4">
          <StudioBurgerMenu />
          <Link href="/studio/games" className="flex items-center">
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
