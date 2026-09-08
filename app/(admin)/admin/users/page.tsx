import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/actions/admin/guard";
import { getAdminUsers } from "@/lib/api/games";
import { deleteUserByIdAction } from "@/actions/admin";
import { SearchInput } from "@/components/admin/SearchInput";
import type { UserRole } from "@/types";

const PAGE_SIZE = 10;

const UsersPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{ page?: string; q?: string }>;
}) => {
  await requireAdmin();
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const offset = page * PAGE_SIZE;
  const searchEmail = q?.trim() || undefined;

  const data = await getAdminUsers(page, PAGE_SIZE, searchEmail);
  const { content: users, page: pageInfo } = data;
  const totalPages = pageInfo.totalPages;
  const start = pageInfo.totalElements === 0 ? 0 : offset + 1;
  const end = Math.min(offset + PAGE_SIZE, pageInfo.totalElements);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]">
            Users
          </p>
          <h1 className="text-xl font-bold tracking-[0.4px] text-[#FAFAFA]">
            Usuarios
          </h1>
          <p className="text-sm text-[#8A8A8A]">
            {pageInfo.totalElements} user
            {pageInfo.totalElements !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="bg-[#28282C] hover:bg-[#404044] text-[#FAFAFA] text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          + Nuevo usuario
        </Link>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput placeholder="Buscar por email..." paramName="q" />
        {searchEmail && (
          <Link
            href="/admin/users"
            className="text-sm text-[#8A8A8A] hover:text-white whitespace-nowrap"
          >
            Limpiar filtro
          </Link>
        )}
      </div>

      <div className="bg-[#202024] border border-white/[0.06] rounded-lg overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-[#18181C] text-left text-[#8A8A8A] text-xs font-bold uppercase tracking-[0.5px]">
              <th className="px-3 py-3 w-16 hidden md:table-cell">ID</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3 w-28">Role</th>
              <th className="px-3 py-3 w-28 hidden sm:table-cell">Created</th>
              <th className="px-3 py-3 w-36 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-[#8A8A8A]"
                >
                  {searchEmail
                    ? `No users found matching "${searchEmail}"`
                    : "No users found"}
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-white/[0.06] hover:bg-[#28282C] transition-colors"
                >
                  <td className="px-3 py-3 text-[#8A8A8A] hidden md:table-cell">
                    #{u.id}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-[#007AFF] hover:underline truncate block"
                    >
                      {u.email}
                    </Link>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold inline-block ${
                        u.role === ("ADMIN" as UserRole)
                          ? "bg-[#28282C] text-[#FAFAFA]"
                          : "bg-[#101014] text-[#8A8A8A]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[#8A8A8A] text-xs hidden sm:table-cell">
                    {new Date(u.createdAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-[#007AFF] hover:text-[#1ea4ff] text-sm font-medium"
                      >
                        Edit
                      </Link>
                      {u.role === ("ADMIN" as UserRole) ? (
                        <span className="text-[#5A5A5A] text-sm">—</span>
                      ) : (
                        <DeleteUserButton id={u.id} email={u.email} />
                      )}
                    </div>
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
            {Array.from({ length: totalPages }, (_, i) => {
              const href = searchEmail
                ? `/admin/users?page=${i}&q=${encodeURIComponent(searchEmail)}`
                : `/admin/users?page=${i}`;
              return (
                <Link
                  key={i}
                  href={href}
                  className={`size-8 flex items-center justify-center rounded-md text-sm ${
                    i === page
                      ? "bg-[#28282C] text-white"
                      : "text-[#8A8A8A] hover:bg-[#28282C] hover:text-white"
                  }`}
                >
                  {i + 1}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

const DeleteUserButton = ({ id, email }: { id: number; email: string }) => {
  return (
    <form
      action={async () => {
        "use server";
        await deleteUserByIdAction(id);
        revalidatePath("/admin/users");
      }}
      className="inline"
    >
      <button
        type="submit"
        className="text-[#FF6B6B] hover:text-red-400 text-sm font-medium"
        aria-label={`Delete user ${email}`}
      >
        Delete
      </button>
    </form>
  );
};

export default UsersPage;
