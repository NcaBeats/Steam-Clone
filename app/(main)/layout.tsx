import { Nav, Header } from "@/components/layout";

export default function MainLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
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
