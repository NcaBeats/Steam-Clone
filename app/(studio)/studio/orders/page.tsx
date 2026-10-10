import Link from "next/link";
import { requireRole } from "@/actions/admin/guard";
import { getManageOrders } from "@/lib/api/games";

const PAGE_SIZE = 10;

const statusClasses: Record<string, string> = {
  COMPLETED: "bg-muted text-foreground",
  PENDING: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/10 text-destructive border border-destructive/20",
  REFUNDED: "bg-muted text-muted-foreground",
};

const StudioOrdersPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{ page?: string }>;
}) => {
  await requireRole(["VENDEDOR"], "/admin");
  const { page: pageParam } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));

  const data = await getManageOrders(page, PAGE_SIZE);
  const { content: orders, page: pageInfo } = data;
  const totalPages = pageInfo.totalPages;
  const start = pageInfo.totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE + PAGE_SIZE, pageInfo.totalElements);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-muted-foreground">
          Orders
        </p>
        <h1 className="text-xl font-bold tracking-[0.4px] text-foreground">
          Orders
        </h1>
        <p className="text-sm text-muted-foreground">
          {pageInfo.totalElements} order
          {pageInfo.totalElements !== 1 ? "s" : ""} in your catalog
        </p>
      </header>

      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-muted/50 text-left text-muted-foreground text-xs font-bold uppercase tracking-[0.5px]">
              <th className="px-3 py-3 w-20 hidden sm:table-cell">ID</th>
              <th className="px-3 py-3">Buyer</th>
              <th className="px-3 py-3 text-right w-24">Date</th>
              <th className="px-3 py-3 text-center w-16">Items</th>
              <th className="px-3 py-3 text-right w-24">Total</th>
              <th className="px-3 py-3 w-28 hidden md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-muted-foreground"
                >
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-3 py-3 text-muted-foreground hidden sm:table-cell">
                    #{o.id}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/studio/orders/${o.id}`}
                      className="text-foreground hover:underline truncate block"
                    >
                      {o.buyerEmail}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-xs text-right">
                    {new Date(o.purchasedAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-3 py-3 text-foreground text-center">
                    {o.items.length}
                  </td>
                  <td className="px-3 py-3 text-foreground text-right whitespace-nowrap">
                    ${o.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold inline-block ${
                        statusClasses[o.status] ??
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            Showing {start}-{end} of {pageInfo.totalElements}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i}
                href={`/studio/orders?page=${i}`}
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
      )}
    </div>
  );
};

export default StudioOrdersPage;
