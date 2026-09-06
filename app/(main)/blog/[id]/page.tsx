import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { getBlogById, getBlogs } from "@/lib/api/blogs";
import { BlogCard } from "@/components/blog";

type Props = {
  readonly params: Promise<{ id: string }>;
};

const BlogDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  let blog;
  try {
    blog = await getBlogById(Number(id));
  } catch {
    notFound();
  }

  if (!blog) {
    notFound();
  }

  const date = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const related = (await getBlogs())
    .filter((b) => b.id !== blog.id)
    .slice(0, 3);

  return (
    <article className="flex flex-col gap-12 w-full max-w-3xl mx-auto py-12 px-4">
      <Link
        href="/blog"
        className="flex items-center gap-1 text-sm text-[#8A8A8A] hover:text-[#007AFF] transition-colors self-start"
      >
        <ArrowLeft size={16} />
        Back to blog
      </Link>

      {blog.coverImage && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#0A0A0A]">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs text-[#8A8A8A]">
          {blog.category && (
            <span className="bg-[#007AFF] text-white px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wide">
              {blog.category}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {date}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FAFAFA] leading-tight">
          {blog.title}
        </h1>
        <p className="text-base text-[#C0C0C0] italic">{blog.excerpt}</p>
      </header>

      <div className="text-[#EDEDED] text-base leading-relaxed whitespace-pre-line">
        {blog.content}
      </div>

      {related.length > 0 && (
        <section className="flex flex-col gap-4 border-t border-[#2A2A2A] pt-8">
          <h2 className="text-xl font-bold text-[#FAFAFA]">More posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default BlogDetailPage;
