import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/types";

type Props = Readonly<{ blog: Blog }>;

export const BlogCard = ({ blog }: Props) => {
  const date = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${blog.id}`}
      className="group bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg overflow-hidden flex flex-col hover:border-[#3A3A3A] transition-colors"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-[#0A0A0A]">
        {blog.coverImage ? (
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#3A3A3A] text-sm">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
          {blog.category && (
            <span className="bg-[#007AFF] text-white px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wide">
              {blog.category}
            </span>
          )}
          <span>{date}</span>
        </div>
        <h3 className="text-lg font-semibold text-[#FAFAFA] line-clamp-2 group-hover:text-[#007AFF]  transition-colors">
          {blog.title}
        </h3>
        <p className="text-sm text-[#C0C0C0] line-clamp-3">{blog.excerpt}</p>
      </div>
    </Link>
  );
};
