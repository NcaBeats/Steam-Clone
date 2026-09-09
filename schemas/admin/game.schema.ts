import * as z from "zod";

export const GameStateSchema = z.enum([
  "AVAILABLE",
  "COMING_SOON",
  "DISCONTINUED",
]);

export const GameMetadataSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name cannot exceed 50 characters"),
  originalPrice: z.coerce.number().min(0, "Price cannot be negative"),
  discountPercent: z.coerce
    .number()
    .min(0, "The minimum discount is 0")
    .max(100, "The maximum discount is 100"),
  description: z.string().trim().min(1, "Description is required"),
  state: GameStateSchema,
  launchDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Launch date is not valid"),
  categoryNames: z
    .array(z.string().trim().min(1, "Invalid category"))
    .min(1, "Select at least one category"),
  minimumSpecs: z.string().optional().default(""),
  recommendedSpecs: z.string().optional().default(""),
});

export type GameMetadata = z.infer<typeof GameMetadataSchema>;
