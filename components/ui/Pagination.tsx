import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

type Props = Readonly<{
  page: number;
  totalPages: number;
  basePath: string;
}>;

const pageLinkCls = (disabled: boolean) =>
  cn(
    buttonVariants({ variant: "outline", size: "sm" }),
    disabled && "pointer-events-none opacity-50",
  );

export const Pagination = ({ page, totalPages, basePath }: Props) => {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => `${basePath}?page=${p}`;

  return (
    <ButtonGroup aria-label="Pagination" className="mt-2">
      <Link
        href={hrefFor(Math.max(0, page - 1))}
        data-slot="button"
        aria-disabled={page === 0}
        className={pageLinkCls(page === 0)}
      >
        <ChevronLeftIcon />
        Previous
      </Link>
      {Array.from({ length: totalPages }, (_, i) => (
        <Link
          key={i}
          href={hrefFor(i)}
          data-slot="button"
          aria-current={i === page ? "page" : undefined}
          className={buttonVariants({
            variant: i === page ? "default" : "outline",
            size: "sm",
          })}
        >
          {i + 1}
        </Link>
      ))}
      <Link
        href={hrefFor(Math.min(totalPages - 1, page + 1))}
        data-slot="button"
        aria-disabled={page === totalPages - 1}
        className={pageLinkCls(page === totalPages - 1)}
      >
        Next
        <ChevronRightIcon />
      </Link>
    </ButtonGroup>
  );
};
