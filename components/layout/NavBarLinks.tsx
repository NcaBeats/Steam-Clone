import Link from "next/link";

export const NavBarLiks = () => {
  return (
    <ul className="flex justify-around w-32">
      <li className="text-white">
        <Link href={"/"}>Home</Link>
      </li>
      <li className="text-white">
        <Link href={"/"}>Library</Link>
      </li>
    </ul>
  );
};
