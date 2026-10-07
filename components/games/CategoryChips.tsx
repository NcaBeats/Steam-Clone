"use client";

import type { Category } from "@/types";
import { Badge } from "@/components/ui/badge";

type Props = Readonly<{ categories: Category[] }>;

export const CategoryChips = ({ categories }: Props) => {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl text-foreground ml-1">Browse by category</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map(({ id, name }) => (
          <Badge
            key={id}
            variant="secondary"
            className="cursor-pointer"
            render={<a href={`#category-${name}`}>{name}</a>}
          />
        ))}
      </div>
    </div>
  );
};
