import Link from "next/link";
import { requireAdmin } from "@/actions/admin/guard";
import { getAdminUsers } from "@/lib/api/games";
import { SearchInput } from "@/components/admin/SearchInput";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
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
          <p className="text-xs font-bold uppercase tracking-[0.5px] text-muted-foreground">
            Users
          </p>
          <h1 className="text-xl font-bold tracking-[0.4px] text-foreground">
            Usuarios
          </h1>
          <p className="text-sm text-muted-foreground">
            {pageInfo.totalElements} user
            {pageInfo.totalElements !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          + Nuevo usuario
        </Link>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput placeholder="Search by email..." paramName="q" />
        {searchEmail && (
          <Link
            href="/admin/users"
            className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            Limpiar filtro
          </Link>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-muted/50 text-left text-muted-foreground text-xs font-bold uppercase tracking-[0.5px]">
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
                  className="px-3 py-8 text-center text-muted-foreground"
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
                  className="border-t border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-3 py-3 text-muted-foreground hidden md:table-cell">
                    #{u.id}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-foreground hover:underline truncate block"
                    >
                      {u.email}
                    </Link>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold inline-block ${
                        u.role === "ADMIN"
                          ? "bg-muted text-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                    {new Date(u.createdAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-foreground hover:underline text-sm font-medium"
                      >
                        Edit
                      </Link>
                      {u.role === "ADMIN" ? (
                        <span className="text-muted-foreground text-sm">—</span>
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
          <span className="text-muted-foreground">
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
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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

export default UsersPage;
