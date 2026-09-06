import { Nav, Header } from "@/components/layout";
import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/actions/admin/auth";

export default async function MainLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = await getCurrentUserAction();

  if (user?.role === "VENDEDOR") {
    redirect("/studio/games");
  }

  return (
    <>
      <Header>
        <div className="max-w-7xl mx-auto w-full h-full">
          <Nav />
        </div>
      </Header>
      {children}
      <footer>Footer</footer>
    </>
  );
}
