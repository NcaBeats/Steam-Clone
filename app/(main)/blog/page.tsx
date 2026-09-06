import { Newspaper } from "lucide-react";
import { BlogCard } from "@/components/blog";
import { getBlogs } from "@/lib/api/blogs";

const BlogPage = async () => {
  const blogs = await getBlogs();

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-12 px-4">
      <section className="flex flex-col items-center text-center gap-3">
        <Newspaper className="size-12 text-[#007AFF]" />
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FAFAFA]">Blog</h1>
        <p className="text-sm sm:text-base text-[#8A8A8A] max-w-xl">
          Latest news, updates, and insights about games and our platform.
        </p>
      </section>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <p className="text-[#8A8A8A] text-lg">No posts yet</p>
          <p className="text-sm text-[#5A5A5A]">Check back soon for updates.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </section>
      )}
    </div>
  );
};

export default BlogPage;
