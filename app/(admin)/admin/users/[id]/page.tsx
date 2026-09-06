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
        className="flex items-center gap-1 text-sm text-[#8A8A8A] hover:text-white self-start"
      >
        <ArrowLeft size={16} />
        Back to users
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Edit user</h1>
          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold ${
              user.role === "ADMIN"
                ? "bg-[#007AFF] text-white"
                : "bg-[#2A2A2A] text-[#8A8A8A]"
            }`}
          >
            {user.role}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 flex items-center gap-3">
          <Mail size={18} className="text-[#007AFF]" />
          <div>
            <p className="text-xs text-[#8A8A8A]">Email</p>
            <p className="text-sm text-[#FAFAFA]">{user.email}</p>
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 flex items-center gap-3">
          <Shield size={18} className="text-[#A1CD44]" />
          <div>
            <p className="text-xs text-[#8A8A8A]">Role</p>
            <p className="text-sm text-[#FAFAFA]">{user.role}</p>
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 flex items-center gap-3 sm:col-span-2">
          <Calendar size={18} className="text-[#8A8A8A]" />
          <div>
            <p className="text-xs text-[#8A8A8A]">Created at</p>
            <p className="text-sm text-[#FAFAFA]">
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
