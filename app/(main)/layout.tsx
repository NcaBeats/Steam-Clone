import { Nav, Header } from "@/components/layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
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
