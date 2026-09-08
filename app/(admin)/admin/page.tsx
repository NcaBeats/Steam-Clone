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
      color: "text-[#8A8A8A]",
    },
    {
      label: "Total Games",
      value: totalGames.toString(),
      icon: ShoppingBag,
      color: "text-[#8A8A8A]",
    },
    {
      label: "Active Games",
      value: activeGames.toString(),
      icon: LayoutDashboard,
      color: "text-[#8A8A8A]",
    },
    {
      label: "Catalog Value",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-[#8A8A8A]",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]">
          Dashboard
        </p>
        <h1 className="text-xl font-bold tracking-[0.4px] text-[#FAFAFA]">
          HELLO Administrator!
        </h1>
        <p className="text-sm text-[#8A8A8A]">
          Welcome to your dashboard. Here is a quick overview of your store.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#202024] border border-white/[0.06] rounded-lg p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]">
                  {stat.label}
                </span>
                <Icon size={16} className={stat.color} />
              </div>
              <span
                className={`text-xl font-bold tracking-[0.4px] ${
                  stat.label === "Catalog Value"
                    ? "text-[#26BBFF]"
                    : "text-[#FAFAFA]"
                }`}
              >
                {stat.value}
              </span>
            </div>
          );
        })}
      </section>

      <section className="bg-[#202024] border border-white/[0.06] rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-base font-bold tracking-[0.32px] text-[#FAFAFA]">
          Quick actions
        </h2>
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
