import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, DollarSign, Tag } from "lucide-react";
import { requireRole } from "@/actions/admin/guard";
import { getManageGameById } from "@/lib/api/games";
import type { Game } from "@/types";

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
          <h1 className="text-2xl font-bold text-[#FAFAFA]">{game.name}</h1>
          <div className="flex items-center gap-2 text-sm text-[#8A8A8A]">
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                game.state === "AVAILABLE"
                  ? "bg-[#A1CD44] text-black"
                  : "bg-[#2A2A2A] text-[#FAFAFA]"
              }`}
            >
              {game.state}
            </span>
            <span>#{game.id}</span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 flex items-center gap-3">
          <DollarSign size={18} className="text-[#A1CD44]" />
          <div>
            <p className="text-xs text-[#8A8A8A]">Price</p>
            <p className="text-sm text-[#FAFAFA]">${game.price.toFixed(2)}</p>
            {game.discountPercent > 0 && (
              <p className="text-xs text-[#A1CD44]">
                -{game.discountPercent}% off
              </p>
            )}
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 flex items-center gap-3">
          <Calendar size={18} className="text-[#8A8A8A]" />
          <div>
            <p className="text-xs text-[#8A8A8A]">Launch date</p>
            <p className="text-sm text-[#FAFAFA]">
              {new Date(game.launchDate).toLocaleDateString("en-US")}
            </p>
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 flex items-center gap-3">
          <Tag size={18} className="text-[#8A8A8A]" />
          <div>
            <p className="text-xs text-[#8A8A8A]">Categories</p>
            <p className="text-sm text-[#FAFAFA] line-clamp-2">
              {game.categories.map((c) => c.name).join(", ")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-[#FAFAFA] uppercase tracking-wide">
          Descripción
        </h2>
        <p className="text-sm text-[#8A8A8A] whitespace-pre-line">
          {game.description}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#FAFAFA] uppercase tracking-wide">
            Requisitos mínimos
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
        <section className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[#FAFAFA] uppercase tracking-wide">
            Requisitos recomendados
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
