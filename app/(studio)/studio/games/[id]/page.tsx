import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, DollarSign, Tag } from "lucide-react";
import { requireRole } from "@/actions/admin/guard";
import { getManageGameById } from "@/lib/api/games";

const StudioGameDetailPage = async ({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) => {
  await requireRole(["VENDEDOR"], "/admin");
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const game = await getManageGameById(id);
  if (!game) notFound();

  const specEntries = (raw: string | null) => {
    if (!raw) return [];
    try {
      return Object.entries(JSON.parse(raw));
    } catch {
      return [];
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/studio/games"
        className="flex items-center gap-1 text-sm text-[#8A8A8A] hover:text-white self-start"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <header className="flex items-center gap-4">
        <div className="relative w-24 h-32 rounded overflow-hidden shrink-0">
          <Image
            src={game.imageUrl}
            alt={game.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-[0.4px] text-[#FAFAFA]">
            {game.name}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[#8A8A8A]">
            <span
              className={`px-2.5 py-1 rounded text-xs font-semibold inline-block ${
                game.state === "AVAILABLE"
                  ? "bg-[#28282C] text-[#FAFAFA]"
                  : "bg-[#101014] text-[#8A8A8A]"
              }`}
            >
              {game.state}
            </span>
            <span>#{game.id}</span>
            <Link
              href={`/studio/games/${game.id}/edit`}
              className="text-[#8A8A8A] hover:text-white text-sm font-medium"
            >
              Edit
            </Link>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#202024] border border-white/[0.06] rounded-lg p-4 flex items-center gap-3">
          <DollarSign size={18} className="text-[#26BBFF]" />
          <div>
            <p className="text-xs text-[#8A8A8A]">Price</p>
            <p className="text-sm text-[#FAFAFA]">${game.price.toFixed(2)}</p>
            {game.discountPercent > 0 && (
              <p className="text-xs text-[#26BBFF]">
                -{game.discountPercent}% off
              </p>
            )}
          </div>
        </div>
        <div className="bg-[#202024] border border-white/[0.06] rounded-lg p-4 flex items-center gap-3">
          <Calendar size={18} className="text-[#8A8A8A]" />
          <div>
            <p className="text-xs text-[#8A8A8A]">Launch date</p>
            <p className="text-sm text-[#FAFAFA]">
              {new Date(game.launchDate).toLocaleDateString("en-US")}
            </p>
          </div>
        </div>
        <div className="bg-[#202024] border border-white/[0.06] rounded-lg p-4 flex items-center gap-3">
          <Tag size={18} className="text-[#8A8A8A]" />
          <div>
            <p className="text-xs text-[#8A8A8A]">Categories</p>
            <p className="text-sm text-[#FAFAFA] line-clamp-2">
              {game.categories.map((c) => c.name).join(", ")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#202024] border border-white/[0.06] rounded-lg p-5 flex flex-col gap-2">
        <h2 className="text-sm font-bold text-[#FAFAFA] uppercase tracking-[0.5px]">
          Description
        </h2>
        <p className="text-sm text-[#8A8A8A] whitespace-pre-line">
          {game.description}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-[#202024] border border-white/[0.06] rounded-lg p-5 flex flex-col gap-2">
          <h2 className="text-sm font-bold text-[#FAFAFA] uppercase tracking-[0.5px]">
            Minimum requirements
          </h2>
          {specEntries(game.minimumSpecs).length > 0 ? (
            <ul className="flex flex-col gap-1.5 text-sm">
              {specEntries(game.minimumSpecs).map(([key, value]) => (
                <li key={key} className="flex justify-between gap-4">
                  <span className="text-[#8A8A8A] capitalize">{key}</span>
                  <span className="text-[#FAFAFA] text-right">
                    {String(value)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#8A8A8A]">—</p>
          )}
        </section>
        <section className="bg-[#202024] border border-white/[0.06] rounded-lg p-5 flex flex-col gap-2">
          <h2 className="text-sm font-bold text-[#FAFAFA] uppercase tracking-[0.5px]">
            Recommended requirements
          </h2>
          {specEntries(game.recommendedSpecs).length > 0 ? (
            <ul className="flex flex-col gap-1.5 text-sm">
              {specEntries(game.recommendedSpecs).map(([key, value]) => (
                <li key={key} className="flex justify-between gap-4">
                  <span className="text-[#8A8A8A] capitalize">{key}</span>
                  <span className="text-[#FAFAFA] text-right">
                    {String(value)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#8A8A8A]">—</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudioGameDetailPage;
