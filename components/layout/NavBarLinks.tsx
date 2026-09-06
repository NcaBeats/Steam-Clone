import Link from "next/link";

type Props = Readonly<{
  isLoggedIn: boolean;
  isStaff?: boolean;
  staffHref?: string;
}>;

export const NavBarLinks = ({
  isLoggedIn,
  isStaff = false,
  staffHref = "/admin",
}: Props) => {
  return (
    <ul className="sm:flex hidden text-[#8A8A8A] font-medium justify-around gap-6 [&_a]:hover:text-[#007AFF] [&_a]:active:text-[#007AFF]">
      <li>
        <Link href={"/"}>Home</Link>
      </li>
      <li>
        <Link href={"/catalog"}>Catalog</Link>
      </li>
      <li>
        <Link href={"/about"}>About</Link>
      </li>
      <li>
        <Link href={"/contact"}>Contact</Link>
      </li>
      <li>
        <Link href={"/blog"}>Blog</Link>
      </li>
      {isLoggedIn && (
        <li>
          <Link href={"/library"}>Library</Link>
        </li>
      )}
      {isStaff && (
        <li>
          <Link href={staffHref}>Panel</Link>
        </li>
      )}
    </ul>
  );
};
