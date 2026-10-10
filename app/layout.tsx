import "./globals.css";
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AlertProvider } from "@/components/feedback";

export const metadata: Metadata = {
  title: {
    default: "MBR - Games Store",
    template: "%s | MBR",
  },
  description:
    "Discover, buy, and play the best PC titles at fair prices, with deals all week.",
};

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "dark",
        inter.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <AlertProvider>{children}</AlertProvider>
      </body>
    </html>
  );
}
