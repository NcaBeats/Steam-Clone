import Link from "next/link";

type Props = Readonly<{ isLoggedIn: boolean }>;

export const NavBarLinks = ({ isLoggedIn }: Props) => {
  return (
    <ul className="sm:flex hidden text-[#8A8A8A] font-medium justify-around gap-6 [&_a]:hover:text-[#007AFF] [&_a]:active:text-[#007AFF]">
      <li>
        <Link href={"/"}>Home</Link>
      </li>
      <li>
        <Link href={"/catalog"}>Catalog</Link>
      </li>
      {isLoggedIn && (
        <li>
          <Link href={"/library"}>Library</Link>
        </li>
      )}
    </ul>
  );
};
