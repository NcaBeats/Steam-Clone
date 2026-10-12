import { Nav, Header, Footer } from "@/components/layout";
import { getCurrentUserAction } from "@/actions/admin/auth";

export default async function MainLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  await getCurrentUserAction();

  return (
    <>
      <Header>
        <div className="max-w-7xl mx-auto w-full h-full">
          <Nav />
        </div>
      </Header>
      <main>{children}</main>
      <Footer />
    </>
  );
}
