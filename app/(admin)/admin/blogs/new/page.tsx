import Link from "next/link";
import { requireAdmin } from "@/actions/admin/guard";
import { BlogForm } from "@/components/admin/BlogForm";

const NewBlogPage = async () => {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <header className="flex flex-col gap-1">
        <Link
          href="/admin/blogs"
          className="text-sm text-muted-foreground hover:text-foreground self-start"
        >
          ← Back to blogs
        </Link>
        <h1 className="text-2xl font-bold text-foreground">New blog</h1>
        <p className="text-sm text-muted-foreground">
          Create a new blog entry. You can upload a cover image below.
        </p>
      </header>

      <BlogForm />
    </div>
  );
};

export default NewBlogPage;
