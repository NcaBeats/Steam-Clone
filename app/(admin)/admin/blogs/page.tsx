import Link from "next/link";
import { Plus } from "lucide-react";
import { requireRole } from "@/actions/admin/guard";
import { getAdminBlogs } from "@/lib/api/blogs";
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
  parseSortParam,
} from "@/components/admin/dashboard/admin-table";

const PAGE_SIZE = 10;

const ALLOWED_SORTS = ["title", "publishedAt"] as const;

const BlogsPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
}) => {
  await requireRole(["ADMIN"], "/studio/games");
  const { page: pageParam, q, sort: sortParam } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const searchQuery = q?.trim() || undefined;
  const sort = parseSortParam(sortParam?.trim(), ALLOWED_SORTS);

  const data = await getAdminBlogs(page, PAGE_SIZE, searchQuery, sort);
  const { content: blogs, page: pageInfo } = data;

  const pageQuery: Record<string, string> = {};
  if (searchQuery) pageQuery.q = searchQuery;
  if (sort) pageQuery.sort = sort;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.5px] text-muted-foreground">
            Content
          </p>
          <h1 className="text-xl font-bold tracking-[0.4px] text-foreground">
            Blogs
          </h1>
          <p className="text-sm text-muted-foreground">
            {pageInfo.totalElements} blog
            {pageInfo.totalElements !== 1 ? "s" : ""} published
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          <Plus size={16} />
          Nuevo blog
        </Link>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput placeholder="Search by title..." paramName="q" />
        {searchQuery && (
          <Link
            href="/admin/blogs"
            className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            Limpiar filtro
          </Link>
        )}
      </div>

      <AdminTable>
        <AdminTableHeader
          basePath="/admin/blogs"
          query={pageQuery}
          sort={sort}
          columns={[
            { label: "ID", className: "w-16 hidden md:table-cell" },
            { label: "Title", sortKey: "title" },
            { label: "Category", className: "w-28 hidden sm:table-cell" },
            {
              label: "Published",
              className: "w-32 hidden sm:table-cell",
              sortKey: "publishedAt",
            },
            { label: "Actions", className: "w-24 text-right" },
          ]}
        />
        <TableBody>
          {blogs.length === 0 ? (
            <AdminTableEmpty colSpan={5}>
              {searchQuery
                ? `No blogs found matching "${searchQuery}"`
                : "No blogs found"}
            </AdminTableEmpty>
          ) : (
            blogs.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="px-3 py-3 text-muted-foreground hidden md:table-cell">
                  #{b.id}
                </TableCell>
                <TableCell className="px-3 py-3 whitespace-normal">
                  <Link
                    href={`/admin/blogs/${b.id}`}
                    className="text-foreground hover:underline truncate block"
                  >
                    {b.title}
                  </Link>
                  <p className="text-muted-foreground text-xs truncate">
                    {b.excerpt}
                  </p>
                </TableCell>
                <TableCell className="px-3 py-3 hidden sm:table-cell whitespace-nowrap">
                  {b.category ? (
                    <span className="px-2.5 py-1 rounded text-xs font-semibold inline-block bg-muted text-foreground">
                      {b.category}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      —
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-3 py-3 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                  {new Date(b.publishedAt).toLocaleDateString("en-US")}
                </TableCell>
                <AdminTableActions>
                  <RowActions kind="blog" id={b.id} label={b.title} />
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
        basePath="/admin/blogs"
        query={Object.keys(pageQuery).length > 0 ? pageQuery : undefined}
      />
    </div>
  );
};

export default BlogsPage;
