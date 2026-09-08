import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, Receipt } from "lucide-react";
import { requireRole } from "@/actions/admin/guard";
import { getManageOrder } from "@/lib/api/games";

const statusClasses: Record<string, string> = {
  COMPLETED: "bg-[#28282C] text-[#FAFAFA]",
  PENDING: "bg-[#101014] text-[#8A8A8A]",
  CANCELLED: "bg-[#2A1A1A] border border-[#5C2A2A] text-[#FF6B6B]",
  REFUNDED: "bg-[#101014] text-[#8A8A8A]",
};

const StudioOrderDetailPage = async ({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) => {
  await requireRole(["VENDEDOR"], "/admin");
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const order = await getManageOrder(id);
  if (!order) notFound();

  const itemCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/studio/orders"
        className="flex items-center gap-1 text-sm text-[#8A8A8A] hover:text-white self-start"
      >
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <header className="flex items-center gap-2">
        <Receipt size={20} className="text-[#8A8A8A]" />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-[0.4px] text-[#FAFAFA]">
            Order #{id}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[#8A8A8A]">
            <span
              className={`px-2.5 py-1 rounded text-xs font-semibold inline-block ${
                statusClasses[order.status] ?? "bg-[#101014] text-[#8A8A8A]"
              }`}
            >
              {order.status}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(order.purchasedAt).toLocaleString("en-US")}
            </span>
          </div>
        </div>
      </header>

      <section className="bg-[#202024] border border-white/[0.06] rounded-lg p-4 flex items-center gap-3">
        <Mail size={18} className="text-[#8A8A8A]" />
        <div>
          <p className="text-xs text-[#8A8A8A]">Buyer</p>
          <p className="text-sm text-[#FAFAFA]">{order.buyerEmail}</p>
        </div>
      </section>

      <section className="bg-[#202024] border border-white/[0.06] rounded-lg overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-[#18181C] text-left text-[#8A8A8A] text-xs font-bold uppercase tracking-[0.5px]">
              <th className="px-3 py-3">Game</th>
              <th className="px-3 py-3 w-16 hidden sm:table-cell">Qty</th>
              <th className="px-3 py-3 w-32 hidden sm:table-cell text-right">
                Unit
              </th>
              <th className="px-3 py-3 w-24 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-white/[0.06] hover:bg-[#28282C] transition-colors"
              >
                <td className="px-3 py-3 text-[#FAFAFA]">{item.gameName}</td>
                <td className="px-3 py-3 text-[#8A8A8A] hidden sm:table-cell">
                  {item.quantity}
                </td>
                <td className="px-3 py-3 text-[#8A8A8A] hidden sm:table-cell text-right">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="px-3 py-3 text-[#FAFAFA] text-right whitespace-nowrap">
                  ${item.subtotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-[#202024] border border-white/[0.06] rounded-lg p-4 flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between text-[#8A8A8A]">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex justify-between text-[#8A8A8A]">
          <span>Total</span>
          <span className="text-lg font-bold text-[#FAFAFA]">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
      </section>
    </div>
  );
};

export default StudioOrderDetailPage;
