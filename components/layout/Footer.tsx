import Link from "next/link";
import { Erica_One } from "next/font/google";

const ericaOne = Erica_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-erica-one",
});

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "News & Blog" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#101014] text-[#a8a8ad] text-sm border-t border-[#404044]/40 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className={`text-2xl text-white ${ericaOne.className}`}>
                MBR
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              Your games store. Discover, buy, and play the best PC titles at
              fair prices, with deals we do not let slip by, not even on
              weekends.
            </p>
          </div>

          <nav className="flex flex-col md:flex-row md:items-center gap-x-6 gap-y-2 text-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#d6d6da] hover:text-[#26BBFF] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-[#404044]/40 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#6f6f75]">
          <p>© {new Date().getFullYear()} MBR. All rights reserved.</p>
          <p>
            Created by{" "}
            <a
              target="blank"
              href="https://github.com/NcaBeats"
              className="hover:text-[#26BBFF] transition-colors cursor-pointer"
            >
              Nico
            </a>{" "}
            and{" "}
            <a
              target="blank"
              href="https://github.com/benjaminsotoarrano"
              className="hover:text-[#26BBFF] transition-colors cursor-pointer"
            >
              Benja
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
