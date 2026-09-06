import Link from "next/link";
import { requireRole } from "@/actions/admin/guard";
import { getManageOrders } from "@/lib/api/games";

const PAGE_SIZE = 10;

const statusClasses: Record<string, string> = {
  COMPLETED: "bg-[#A1CD44] text-black",
  PENDING: "bg-[#2A2A2A] text-[#FAFAFA]",
  CANCELLED: "bg-[#FF6B6B] text-white",
  REFUNDED: "bg-[#2A2A2A] text-[#FAFAFA]",
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
      <header>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Órdenes</h1>
        <p className="text-sm text-[#8A8A8A]">
          {pageInfo.totalElements} order
          {pageInfo.totalElements !== 1 ? "s" : ""} in your catalog
        </p>
      </header>

      <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-[#1A1A1A] text-left text-[#8A8A8A] text-xs uppercase tracking-wide">
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
                  className="px-3 py-8 text-center text-[#8A8A8A]"
                >
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-[#2A2A2A] hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="px-3 py-3 text-[#8A8A8A] hidden sm:table-cell">
                    #{o.id}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/studio/orders/${o.id}`}
                      className="text-[#007AFF] hover:underline truncate block"
                    >
                      {o.buyerEmail}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-[#8A8A8A] text-xs text-right">
                    {new Date(o.purchasedAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-3 py-3 text-[#FAFAFA] text-center">
                    {o.items.length}
                  </td>
                  <td className="px-3 py-3 text-[#FAFAFA] text-right whitespace-nowrap">
                    ${o.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        statusClasses[o.status] ?? "bg-[#2A2A2A] text-[#8A8A8A]"
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
          <span className="text-[#8A8A8A]">
            Showing {start}-{end} of {pageInfo.totalElements}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i}
                href={`/studio/orders?page=${i}`}
                className={`size-8 flex items-center justify-center rounded text-sm ${
                  i === page
                    ? "bg-[#007AFF] text-white"
                    : "text-[#8A8A8A] hover:bg-[#1A1A1A] hover:text-white"
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
