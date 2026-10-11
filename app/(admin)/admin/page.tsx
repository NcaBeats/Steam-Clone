import { getAdminUsers, getGameStats } from "@/lib/api/games";
import {
  LayoutDashboard,
  Plus,
  Users,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
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
      color: "text-muted-foreground",
    },
    {
      label: "Total Games",
      value: totalGames.toString(),
      icon: ShoppingBag,
      color: "text-muted-foreground",
    },
    {
      label: "Active Games",
      value: activeGames.toString(),
      icon: LayoutDashboard,
      color: "text-muted-foreground",
    },
    {
      label: "Catalog Value",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-muted-foreground">
          Dashboard
        </p>
        <h1 className="text-xl font-bold tracking-[0.4px] text-foreground">
          HELLO Administrator!
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome to your dashboard. Here is a quick overview of your store.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-lg p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.5px] text-muted-foreground">
                  {stat.label}
                </span>
                <Icon size={16} className={stat.color} />
              </div>
              <span
                className={`text-xl font-bold tracking-[0.4px] ${
                  stat.label === "Catalog Value"
                    ? "text-[#26BBFF]"
                    : "text-foreground"
                }`}
              >
                {stat.value}
              </span>
            </div>
          );
        })}
      </section>

      <section className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-base font-bold tracking-[0.32px] text-foreground">
          Quick actions
        </h2>
        <div className="flex flex-col gap-2">
          <Link
            href="/admin/users/new"
            className="inline-flex items-center gap-1.5 text-foreground hover:underline text-sm"
          >
            <Plus size={14} />
            Create new user
          </Link>
          <Link
            href="/admin/games/new"
            className="inline-flex items-center gap-1.5 text-foreground hover:underline text-sm"
          >
            <Plus size={14} />
            Create new product
          </Link>
          <Link
            href="/admin/users"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            View all users
          </Link>
          <Link
            href="/admin/games"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            View all products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminHomePage;
