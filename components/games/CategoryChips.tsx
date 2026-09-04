"use client";

import type { Category } from "@/types";

type Props = Readonly<{ categories: Category[] }>;

export const CategoryChips = ({ categories }: Props) => {
  if (categories.length === 0) return null;

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    name: string,
  ) => {
    e.preventDefault();
    const target = document.getElementById(`category-${name}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl text-[#EDEDED] ml-1">Browse by category</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`#category-${cat.name}`}
            onClick={(e) => handleClick(e, cat.name)}
            className="bg-[#1A1A1A] hover:bg-[#272727] active:bg-[#272727] text-[#EDEDED] text-sm px-3 py-1.5 rounded-md transition-colors duration-200 ease-out border border-[#2A2A2A] cursor-pointer"
          >
            {cat.name}
          </a>
        ))}
      </div>
    </div>
  );
};
