import { getAdminUsers, getGameStats } from "@/lib/api/games";
import { LayoutDashboard, Users, ShoppingBag, DollarSign } from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/actions/admin/guard";

const AdminHomePage = async () => {
  await requireRole(["ADMIN"], "/studio/games");

  const [usersPage, gameStats] = await Promise.all([
    getAdminUsers(0, 1),
    getGameStats(),
  ]);

  const totalUsers = usersPage.page?.totalElements ?? 0;
  const totalGames = gameStats.total;
  const activeGames = gameStats.active;
  const totalRevenue = gameStats.catalogValue;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      color: "text-[#007AFF]",
    },
    {
      label: "Total Games",
      value: totalGames.toString(),
      icon: ShoppingBag,
      color: "text-[#A1CD44]",
    },
    {
      label: "Active Games",
      value: activeGames.toString(),
      icon: LayoutDashboard,
      color: "text-[#FF6B6B]",
    },
    {
      label: "Catalog Value",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-[#FFD700]",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#FAFAFA]">
          ¡HOLA Administrador!
        </h1>
        <p className="text-[#8A8A8A]">
          Welcome to your dashboard. Here is a quick overview of your store.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8A8A8A] uppercase tracking-wide">
                  {stat.label}
                </span>
                <Icon size={16} className={stat.color} />
              </div>
              <span className="text-2xl font-bold text-[#FAFAFA]">
                {stat.value}
              </span>
            </div>
          );
        })}
      </section>

      <section className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-[#FAFAFA]">Quick actions</h2>
        <div className="flex flex-col gap-2">
          <Link
            href="/admin/users/new"
            className="text-[#007AFF] hover:underline text-sm"
          >
            + Create new user
          </Link>
          <Link
            href="/admin/games/new"
            className="text-[#007AFF] hover:underline text-sm"
          >
            + Create new product
          </Link>
          <Link
            href="/admin/users"
            className="text-[#8A8A8A] hover:text-white text-sm"
          >
            View all users
          </Link>
          <Link
            href="/admin/games"
            className="text-[#8A8A8A] hover:text-white text-sm"
          >
            View all products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminHomePage;
