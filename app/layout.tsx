import "./globals.css";
import { Inter } from "next/font/google";
import { Nav, Header } from "@/components/layout";

const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header>
          <Nav></Nav>
        </Header>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  );
}
