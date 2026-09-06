import Image from "next/image";
import Link from "next/link";
import { StudioSidebar } from "@/components/studio/StudioSidebar";
import { StudioBurgerMenu } from "@/components/studio/StudioBurgerMenu";
import { requireRole } from "@/actions/admin/guard";

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
        <header className="sm:hidden bg-[#0A0A0A] border-b border-[#2A2A2A] h-16 flex items-center justify-between px-4">
          <StudioBurgerMenu />
          <Link href="/studio/games" className="flex items-center">
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
