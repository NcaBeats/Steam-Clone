import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, Shield } from "lucide-react";
import { requireAdmin } from "@/actions/admin/guard";
import { getAdminUser } from "@/lib/api/games";
import { UserEditForm } from "./UserEditForm";

const UserDetailPage = async ({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) => {
  await requireAdmin();
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const user = await getAdminUser(id);
  if (!user) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Link
        href="/admin/users"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground self-start"
      >
        <ArrowLeft size={16} />
        Back to users
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Edit user</h1>
          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold ${
              user.role === "ADMIN"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {user.role}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <Mail size={18} className="text-[#007AFF]" />
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm text-foreground">{user.email}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <Shield size={18} className="text-[#A1CD44]" />
          <div>
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="text-sm text-foreground">{user.role}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 sm:col-span-2">
          <Calendar size={18} className="text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Created at</p>
            <p className="text-sm text-foreground">
              {new Date(user.createdAt).toLocaleString("en-US")}
            </p>
          </div>
        </div>
      </section>

      <UserEditForm user={user} />
    </div>
  );
};

export default UserDetailPage;
