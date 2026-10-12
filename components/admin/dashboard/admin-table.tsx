import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "cn";

export type AdminTableColumn = {
  label: string;
  className?: string;
  /** Backend field name: makes the column sortable via ?sort=field,dir. */
  sortKey?: string;
};

/**
 * Validates a raw `?sort=field,dir` param against an allowlist.
 * Returns the normalized value or undefined when absent/invalid.
 */
export function parseSortParam(
  raw: string | undefined,
  allowed: readonly string[],
): string | undefined {
  if (!raw) return undefined;
  const [field, dir] = raw.split(",");
  if (!field || (dir !== "asc" && dir !== "desc")) return undefined;
  if (!allowed.includes(field)) return undefined;
  return `${field},${dir}`;
}

export { TableBody, TableCell, TableRow };

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden [&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-3 sm:[&_th]:px-3">
      <Table className="table-fixed">{children}</Table>
    </div>
  );
}

export function AdminTableHeader({
  columns,
  basePath,
  query,
  sort,
}: {
  columns: AdminTableColumn[];
  basePath?: string;
  query?: Readonly<Record<string, string>>;
  sort?: string;
}) {
  const [sortField, sortDir] = sort?.split(",") ?? [];
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        {columns.map((column) => {
          const isActive =
            column.sortKey !== undefined && column.sortKey === sortField;
          const next =
            column.sortKey === undefined
              ? undefined
              : !isActive
                ? `${column.sortKey},asc`
                : sortDir === "asc"
                  ? `${column.sortKey},desc`
                  : undefined;
          const params = new URLSearchParams();
          if (query) {
            for (const [key, value] of Object.entries(query)) {
              if (key !== "sort" && key !== "page") params.set(key, value);
            }
          }
          if (next) params.set("sort", next);
          const qs = params.toString();
          const href = `${basePath}?${qs}`;
          return (
            <TableHead
              key={column.label}
              aria-sort={
                column.sortKey === undefined
                  ? undefined
                  : isActive
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
              }
              className={cn(
                "px-3 py-3 text-muted-foreground text-xs font-bold uppercase tracking-wide",
                column.className,
              )}
            >
              {column.sortKey !== undefined && basePath !== undefined ? (
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  {column.label}
                  {isActive ? (
                    sortDir === "asc" ? (
                      <ArrowUp size={12} aria-hidden="true" />
                    ) : (
                      <ArrowDown size={12} aria-hidden="true" />
                    )
                  ) : (
                    <ArrowUpDown
                      size={12}
                      aria-hidden="true"
                      className="opacity-50"
                    />
                  )}
                </Link>
              ) : (
                column.label
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

export function AdminTableEmpty({
  colSpan,
  children,
}: {
  colSpan: number;
  children: React.ReactNode;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        className="px-3 py-8 text-center text-muted-foreground"
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

export function AdminTableActions({ children }: { children: React.ReactNode }) {
  return (
    <TableCell className="px-3 py-3 text-right whitespace-nowrap">
      <div className="flex items-center justify-end">{children}</div>
    </TableCell>
  );
}

export function AdminTablePagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  basePath,
  query,
}: {
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  basePath: string;
  query?: Readonly<Record<string, string>>;
}) {
  if (totalPages <= 1) return null;

  const offset = page * pageSize;
  const start = totalElements === 0 ? 0 : offset + 1;
  const end = Math.min(offset + pageSize, totalElements);

  const hrefFor = (i: number) => {
    const params = new URLSearchParams();
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        params.set(key, value);
      }
    }
    params.set("page", String(i));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">
        Showing {start}-{end} of {totalElements}
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i}
            href={hrefFor(i)}
            className={`size-8 flex items-center justify-center rounded-md text-sm ${
              i === page
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </nav>
  );
}
