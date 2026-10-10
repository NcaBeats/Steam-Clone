import Link from "next/link";
import { requireAdmin } from "@/actions/admin/guard";
import { getAdminUsers } from "@/lib/api/games";
import { SearchInput } from "@/components/admin/SearchInput";
import { RowActions } from "@/components/admin/dashboard/row-actions";
import {
  AdminTable,
  AdminTableActions,
  AdminTableEmpty,
  AdminTableHeader,
  AdminTablePagination,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/admin/dashboard/admin-table";
const PAGE_SIZE = 10;

const UsersPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{ page?: string; q?: string }>;
}) => {
  await requireAdmin();
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const searchEmail = q?.trim() || undefined;

  const data = await getAdminUsers(page, PAGE_SIZE, searchEmail);
  const { content: users, page: pageInfo } = data;

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

      <AdminTable>
        <AdminTableHeader
          columns={[
            { label: "ID", className: "w-16 hidden md:table-cell" },
            { label: "Email" },
            { label: "Role", className: "w-28" },
            { label: "Created", className: "w-28 hidden sm:table-cell" },
            { label: "Actions", className: "w-16 text-right" },
          ]}
        />
        <TableBody>
          {users.length === 0 ? (
            <AdminTableEmpty colSpan={5}>
              {searchEmail
                ? `No users found matching "${searchEmail}"`
                : "No users found"}
            </AdminTableEmpty>
          ) : (
            users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="px-3 py-3 text-muted-foreground hidden md:table-cell">
                  #{u.id}
                </TableCell>
                <TableCell className="px-3 py-3">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="text-foreground hover:underline truncate block"
                  >
                    {u.email}
                  </Link>
                </TableCell>
                <TableCell className="px-3 py-3 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-semibold inline-block ${
                      u.role === "ADMIN"
                        ? "bg-muted text-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.role}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                  {new Date(u.createdAt).toLocaleDateString("en-US")}
                </TableCell>
                <AdminTableActions>
                  <RowActions
                    kind="user"
                    id={u.id}
                    label={u.email}
                    allowDelete={u.role !== "ADMIN"}
                  />
                </AdminTableActions>
              </TableRow>
            ))
          )}
        </TableBody>
      </AdminTable>

      <AdminTablePagination
        page={page}
        totalPages={pageInfo.totalPages}
        totalElements={pageInfo.totalElements}
        pageSize={PAGE_SIZE}
        basePath="/admin/users"
        query={searchEmail ? { q: searchEmail } : undefined}
      />
    </div>
  );
};

export default UsersPage;
