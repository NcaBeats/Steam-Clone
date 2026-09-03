import { Nav, Header } from "@/components/layout";

export default function MainLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <>
      <Header>
        <Nav />
      </Header>
      {children}
      <footer>Footer</footer>
    </>
  );
}
