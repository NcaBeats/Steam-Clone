import Link from "next/link";
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
};

export { TableBody, TableCell, TableRow };

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Table className="table-fixed">{children}</Table>
    </div>
  );
}

export function AdminTableHeader({ columns }: { columns: AdminTableColumn[] }) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        {columns.map((column) => (
          <TableHead
            key={column.label}
            className={cn(
              "px-3 py-3 text-muted-foreground text-xs font-bold uppercase tracking-[0.5px]",
              column.className,
            )}
          >
            {column.label}
          </TableHead>
        ))}
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
