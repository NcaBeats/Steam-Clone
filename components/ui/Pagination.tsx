import Link from "next/link";

type Props = Readonly<{
  page: number;
  totalPages: number;
  basePath: string;
}>;

export const Pagination = ({ page, totalPages, basePath }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center gap-1 mt-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <Link
          key={i}
          href={`${basePath}?page=${i}`}
          className={`size-8 flex items-center justify-center rounded text-sm ${
            i === page
              ? "bg-[#007AFF] text-white"
              : "text-[#8A8A8A] hover:bg-[#1A1A1A] hover:text-white"
          }`}
        >
          {i + 1}
        </Link>
      ))}
    </nav>
  );
};
