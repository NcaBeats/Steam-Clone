"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input, Textarea } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldGroup } from "@/components/ui/field";
import { FileDropzone } from "@/components/inputs";
import { useAlert } from "@/components/feedback";
import {
  createBlogAction,
  presignBlogCoverAction,
  updateBlogAction,
} from "@/actions/admin";
import { uploadBlogCover } from "@/lib/blog-upload";
import {
  BlogCategorySchema,
  BlogSchema,
  type BlogInput,
} from "@/schemas/admin/blog.schema";
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

  const parsedCategory = BlogCategorySchema.safeParse(blog?.category ?? null);

  const form = useForm<BlogInput>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: blog?.title ?? "",
      excerpt: blog?.excerpt ?? "",
      content: blog?.content ?? "",
      category: parsedCategory.success ? parsedCategory.data : null,
    },
  });

  const onSubmit = async (values: BlogInput) => {
    try {
      let coverImage: string | undefined;
      if (cover) {
        setUploading("Uploading cover...");
        const publicPath = await uploadBlogCover({
          title: values.title,
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
              ...values,
              ...(coverImage ? { coverImage } : {}),
            })
          : await createBlogAction({
              ...values,
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4"
      >
        <FieldGroup>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    maxLength={200}
                    placeholder="Blog title"
                    className="border-0"
                  />
                </FormControl>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    maxLength={500}
                    placeholder="Short summary..."
                    className="border-0"
                  />
                </FormControl>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={10}
                    placeholder="Full article..."
                    className="border-0"
                  />
                </FormControl>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category (optional)</FormLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={(value) => field.onChange(value || null)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-0" size="lg">
                      <SelectValue placeholder="No category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">No category</SelectItem>
                    {BLOG_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />
        </FieldGroup>

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
          <Button
            type="submit"
            disabled={busy}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
          >
            {busy
              ? (uploading ?? (isEdit ? "Saving..." : "Creating..."))
              : isEdit
                ? "Save changes"
                : "Create blog"}
          </Button>
          <Link
            href={redirectTo}
            className="text-muted-foreground hover:text-foreground text-sm px-4 py-2.5"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Form>
  );
}
