import Link from "next/link";
import { requireRole } from "@/actions/admin/guard";
import { getAdminBlogs } from "@/lib/api/blogs";
import { SearchInput } from "@/components/admin/SearchInput";
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton";

const PAGE_SIZE = 10;

const BlogsPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{ page?: string; q?: string }>;
}) => {
  await requireRole(["ADMIN"], "/studio/games");
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const offset = page * PAGE_SIZE;
  const searchQuery = q?.trim() || undefined;

  const data = await getAdminBlogs(page, PAGE_SIZE, searchQuery);
  const { content: blogs, page: pageInfo } = data;
  const totalPages = pageInfo.totalPages;
  const start = pageInfo.totalElements === 0 ? 0 : offset + 1;
  const end = Math.min(offset + PAGE_SIZE, pageInfo.totalElements);

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
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          + Nuevo blog
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

      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-muted/50 text-left text-muted-foreground text-xs font-bold uppercase tracking-[0.5px]">
              <th className="px-3 py-3 w-16 hidden md:table-cell">ID</th>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3 w-28 hidden sm:table-cell">Category</th>
              <th className="px-3 py-3 w-32 hidden sm:table-cell">Published</th>
              <th className="px-3 py-3 w-36 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-muted-foreground"
                >
                  {searchQuery
                    ? `No blogs found matching "${searchQuery}"`
                    : "No blogs found"}
                </td>
              </tr>
            ) : (
              blogs.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-3 py-3 text-muted-foreground hidden md:table-cell">
                    #{b.id}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/blogs/${b.id}`}
                      className="text-foreground hover:underline truncate block"
                    >
                      {b.title}
                    </Link>
                    <p className="text-muted-foreground text-xs truncate">
                      {b.excerpt}
                    </p>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell whitespace-nowrap">
                    {b.category ? (
                      <span className="px-2.5 py-1 rounded text-xs font-semibold inline-block bg-muted text-foreground">
                        {b.category}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                    {new Date(b.publishedAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/blogs/${b.id}`}
                        className="text-foreground hover:underline text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteBlogButton id={b.id} title={b.title} />
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
              const href = searchQuery
                ? `/admin/blogs?page=${i}&q=${encodeURIComponent(searchQuery)}`
                : `/admin/blogs?page=${i}`;
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

export default BlogsPage;
