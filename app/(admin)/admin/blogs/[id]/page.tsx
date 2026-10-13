import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { requireRole } from "@/actions/admin/guard";
import { getBlogById } from "@/lib/api/blogs";
import type { Blog } from "@/types";
import { BlogForm } from "@/components/admin/BlogForm";

const BlogDetailPage = async ({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) => {
  await requireRole(["ADMIN"], "/");
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const blog = await getBlogById(id);
  if (!blog) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <BackLink />
      <BlogSummary blog={blog} />
      <BlogForm blog={blog} />
    </div>
  );
};

const BackLink = () => (
  <Link
    href="/admin/blogs"
    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground self-start"
  >
    <ArrowLeft size={16} />
    Back to blogs
  </Link>
);

const BlogSummary = ({ blog }: { blog: Blog }) => (
  <header className="flex items-center gap-4">
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold text-foreground">Edit blog</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {blog.category && (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#FCAF17] text-black">
            {blog.category}
          </span>
        )}
        <span>#{blog.id}</span>
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(blog.publishedAt).toLocaleDateString("en-US")}
        </span>
        <span className="flex items-center gap-1">
          <Tag size={14} />
          {blog.coverImage ? "With cover" : "No cover"}
        </span>
      </div>
    </div>
  </header>
);

export default BlogDetailPage;
