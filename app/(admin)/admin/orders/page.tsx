import Link from "next/link";
import { requireRole } from "@/actions/admin/guard";
import { getManageOrders } from "@/lib/api/games";
import {
  AdminTable,
  AdminTableEmpty,
  AdminTableHeader,
  AdminTablePagination,
  TableBody,
  TableCell,
  TableRow,
  parseSortParam,
} from "@/components/admin/dashboard/admin-table";

const PAGE_SIZE = 10;

const ALLOWED_SORTS = ["purchasedAt", "totalAmount"] as const;

const statusClasses: Record<string, string> = {
  COMPLETED: "bg-muted text-foreground",
  PENDING: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/10 text-destructive border border-destructive/20",
  REFUNDED: "bg-muted text-muted-foreground",
};

const OrdersPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{ page?: string; sort?: string }>;
}) => {
  await requireRole(["ADMIN"], "/");
  const { page: pageParam, sort: sortParam } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const sort = parseSortParam(sortParam?.trim(), ALLOWED_SORTS);

  const data = await getManageOrders(page, PAGE_SIZE, sort);
  const { content: orders, page: pageInfo } = data;

  const pageQuery: Record<string, string> = {};
  if (sort) pageQuery.sort = sort;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-muted-foreground">
          Admin
        </p>
        <h1 className="text-xl font-bold tracking-[0.4px] text-foreground">
          Orders
        </h1>
        <p className="text-sm text-muted-foreground">
          {pageInfo.totalElements} order
          {pageInfo.totalElements !== 1 ? "s" : ""} in your catalog
        </p>
      </header>

      <AdminTable>
        <AdminTableHeader
          basePath="/admin/orders"
          query={pageQuery}
          sort={sort}
          columns={[
            { label: "ID", className: "w-20 hidden sm:table-cell" },
            { label: "Buyer" },
            {
              label: "Date",
              className: "text-right w-24",
              sortKey: "purchasedAt",
            },
            { label: "Items", className: "text-center w-16" },
            {
              label: "Total",
              className: "text-right w-24",
              sortKey: "totalAmount",
            },
            { label: "Status", className: "w-28 hidden md:table-cell" },
          ]}
        />
        <TableBody>
          {orders.length === 0 ? (
            <AdminTableEmpty colSpan={6}>No orders yet</AdminTableEmpty>
          ) : (
            orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="px-3 py-3 text-muted-foreground hidden sm:table-cell">
                  #{o.id}
                </TableCell>
                <TableCell className="px-3 py-3 whitespace-normal">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-foreground hover:underline truncate block"
                  >
                    {o.buyerEmail}
                  </Link>
                </TableCell>
                <TableCell className="px-3 py-3 text-muted-foreground text-xs text-right">
                  {new Date(o.purchasedAt).toLocaleDateString("en-US")}
                </TableCell>
                <TableCell className="px-3 py-3 text-foreground text-center">
                  {o.items.length}
                </TableCell>
                <TableCell className="px-3 py-3 text-foreground text-right whitespace-nowrap">
                  ${o.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell className="px-3 py-3 hidden md:table-cell whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-semibold inline-block ${
                      statusClasses[o.status] ??
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {o.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </AdminTable>

      <AdminTablePagination
        page={page}
        totalPages={pageInfo.totalPages}
        totalElements={pageInfo.totalElements}
        pageSize={PAGE_SIZE}
        basePath="/admin/orders"
        query={Object.keys(pageQuery).length > 0 ? pageQuery : undefined}
      />
    </div>
  );
};

export default OrdersPage;
