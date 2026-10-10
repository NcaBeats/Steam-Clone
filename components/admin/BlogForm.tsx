"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input, Textarea } from "@/components/ui";
import { FileDropzone, Select } from "@/components/inputs";
import { useAlert } from "@/components/feedback";
import {
  createBlogAction,
  presignBlogCoverAction,
  updateBlogAction,
} from "@/actions/admin";
import { uploadBlogCover } from "@/lib/blog-upload";
import { BlogCategorySchema, BlogSchema } from "@/schemas/admin/blog.schema";
import type { Blog } from "@/types";

type Props = Readonly<{
  blog?: Blog;
  redirectTo?: string;
}>;

const BLOG_CATEGORIES = BlogCategorySchema.options;

export function BlogForm({ blog, redirectTo = "/admin/blogs" }: Props) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState<string | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  const isEdit = !!blog;
  const busy = pending || uploading !== null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawCategory = formData.get("category")?.toString().trim() ?? "";

    const parsed = BlogSchema.safeParse({
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      category: rawCategory === "" ? undefined : rawCategory,
    });
    if (!parsed.success) {
      showAlert({
        variant: "destructive",
        title: isEdit
          ? "Could not update the blog"
          : "Could not create the blog",
        description: parsed.error.issues[0]?.message ?? "Invalid data",
      });
      return;
    }

    try {
      let coverImage: string | undefined;
      if (cover) {
        setUploading("Uploading cover...");
        const publicPath = await uploadBlogCover({
          title: parsed.data.title,
          cover,
          presignCover: presignBlogCoverAction,
          onProgress: setUploading,
        });
        coverImage = publicPath ?? undefined;
      }

      setUploading("Saving the blog...");
      startTransition(async () => {
        const result = isEdit
          ? await updateBlogAction(blog.id, {
              ...parsed.data,
              ...(coverImage ? { coverImage } : {}),
            })
          : await createBlogAction({
              ...parsed.data,
              ...(coverImage ? { coverImage } : {}),
            });
        if (!result.ok) {
          showAlert({
            variant: "destructive",
            title: isEdit
              ? "Could not update the blog"
              : "Could not create the blog",
            description: result.error ?? "Try again",
          });
          return;
        }
        showAlert({
          variant: "default",
          title: isEdit ? "Blog updated" : "Blog created",
          description: isEdit
            ? "The blog was updated successfully"
            : "The blog was created successfully",
        });
        router.push(redirectTo);
        router.refresh();
      });
    } catch (err) {
      setUploading(null);
      showAlert({
        variant: "destructive",
        title: "Upload failed",
        description:
          err instanceof Error ? err.message : "Could not upload the cover",
      });
    }
  };

  const labelCls = "text-xs text-muted-foreground font-medium";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className={labelCls}>
          Title
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          minLength={1}
          maxLength={200}
          defaultValue={blog?.title ?? ""}
          placeholder="Blog title"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="excerpt" className={labelCls}>
          Excerpt
        </label>
        <Textarea
          id="excerpt"
          name="excerpt"
          required
          rows={3}
          maxLength={500}
          defaultValue={blog?.excerpt ?? ""}
          placeholder="Short summary..."
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="content" className={labelCls}>
          Content
        </label>
        <Textarea
          id="content"
          name="content"
          required
          rows={10}
          defaultValue={blog?.content ?? ""}
          placeholder="Full article..."
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className={labelCls}>
          Category (optional)
        </label>
        <Select
          id="category"
          name="category"
          defaultValue={blog?.category ?? ""}
        >
          <option value="">No category</option>
          {BLOG_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-4">
        <FileDropzone
          kind="image"
          value={cover}
          onChange={(v) => setCover(Array.isArray(v) ? (v[0] ?? null) : v)}
          existingUrl={blog?.coverImage ?? null}
        />
      </div>

      {uploading && (
        <p className="text-xs text-muted-foreground">{uploading}</p>
      )}

      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={busy}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
        >
          {busy
            ? (uploading ?? (isEdit ? "Saving..." : "Creating..."))
            : isEdit
              ? "Save changes"
              : "Create blog"}
        </button>
        <Link
          href={redirectTo}
          className="text-muted-foreground hover:text-foreground text-sm px-4 py-2.5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
