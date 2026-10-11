import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

      <UserEditForm user={user} />
    </div>
  );
};

export default UserDetailPage;
