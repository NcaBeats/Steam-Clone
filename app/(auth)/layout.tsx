import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/actions/admin/auth";

export default async function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = await getCurrentUserAction();

  if (user?.role === "VENDEDOR") {
    redirect("/studio/games");
  }

  return <>{children}</>;
}
