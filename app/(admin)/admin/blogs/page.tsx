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
          <p className="text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]">
            Content
          </p>
          <h1 className="text-xl font-bold tracking-[0.4px] text-[#FAFAFA]">
            Blogs
          </h1>
          <p className="text-sm text-[#8A8A8A]">
            {pageInfo.totalElements} blog
            {pageInfo.totalElements !== 1 ? "s" : ""} published
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="bg-[#28282C] hover:bg-[#404044] text-[#FAFAFA] text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          + Nuevo blog
        </Link>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput placeholder="Search by title..." paramName="q" />
        {searchQuery && (
          <Link
            href="/admin/blogs"
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
                  className="px-3 py-8 text-center text-[#8A8A8A]"
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
                  className="border-t border-white/[0.06] hover:bg-[#28282C] transition-colors"
                >
                  <td className="px-3 py-3 text-[#8A8A8A] hidden md:table-cell">
                    #{b.id}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/blogs/${b.id}`}
                      className="text-[#007AFF] hover:underline truncate block"
                    >
                      {b.title}
                    </Link>
                    <p className="text-[#8A8A8A] text-xs truncate">
                      {b.excerpt}
                    </p>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell whitespace-nowrap">
                    {b.category ? (
                      <span className="px-2.5 py-1 rounded text-xs font-semibold inline-block bg-[#28282C] text-[#FAFAFA]">
                        {b.category}
                      </span>
                    ) : (
                      <span className="text-[#5A5A5A] text-xs whitespace-nowrap">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-[#8A8A8A] hidden sm:table-cell whitespace-nowrap">
                    {new Date(b.publishedAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/blogs/${b.id}`}
                        className="text-[#007AFF] hover:text-[#1ea4ff] text-sm font-medium"
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
          <span className="text-[#8A8A8A]">
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

export default BlogsPage;
