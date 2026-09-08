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
    .min(1, "El nombre es obligatorio")
    .max(50, "El nombre no puede superar 50 caracteres"),
  originalPrice: z.coerce.number().min(0, "El precio no puede ser negativo"),
  discountPercent: z.coerce
    .number()
    .min(0, "El descuento mínimo es 0")
    .max(100, "El descuento máximo es 100"),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  state: GameStateSchema,
  launchDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de lanzamiento no es válida"),
  categoryNames: z
    .array(z.string().trim().min(1, "Categoría inválida"))
    .min(1, "Selecciona al menos una categoría"),
});

export type GameMetadata = z.infer<typeof GameMetadataSchema>;
