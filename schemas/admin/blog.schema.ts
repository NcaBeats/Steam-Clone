import * as z from "zod";

/**
 * Categorias de blog que acepta el backend (`BlogRequest.category`).
 * Enum en mayusculas, case-sensitive: cualquier otro valor -> 400.
 */
export const BlogCategorySchema = z.enum([
  "EVENTS",
  "INDUSTRY",
  "NEWS",
  "REVIEWS",
  "GUIDES",
  "INTERVIEWS",
]);

export type BlogCategory = z.infer<typeof BlogCategorySchema>;

/**
 * Refleja `BlogRequest` del backend:
 * - title requerido, max 200
 * - excerpt requerido, max 500
 * - content requerido, sin limite
 * - coverImage opcional, URL absoluta http(s), max 500
 * - category opcional (enum o null/omitido)
 *
 * El front no envia publishedAt/createdAt: los fija el servidor al crear.
 */
export const BlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt cannot exceed 500 characters"),
  content: z.string().trim().min(1, "Content is required"),
  coverImage: z
    .string()
    .trim()
    .max(500, "Cover image URL cannot exceed 500 characters")
    .refine((val) => val === "" || /^https?:\/\/\S+$/.test(val), {
      message: "Cover image must be an absolute http(s) URL",
    })
    .nullable()
    .optional(),
  category: BlogCategorySchema.nullable().optional(),
});

export type BlogInput = z.infer<typeof BlogSchema>;
