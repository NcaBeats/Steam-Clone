import {
  resolveImageContentType,
  uploadImageToR2,
  type PresignResult,
} from "@/lib/game-upload";
import type { PresignedUploadResponse } from "@/types";

export type PresignBlogCoverFn = (
  title: string,
  contentType: string,
) => Promise<PresignResult<PresignedUploadResponse>>;

type UploadBlogCoverParams = {
  title: string;
  cover: File | null;
  presignCover: PresignBlogCoverFn;
  onProgress?: (message: string) => void;
};

/**
 * Sube la portada del blog por flujo presignado (el archivo no pasa por el
 * server de Next): pide la firma, hace PUT a R2 con el Content-Type firmado
 * y devuelve el publicPath para mandarlo como `coverImage`.
 *
 * Si no hay archivo nuevo devuelve null y el llamador debe omitir
 * `coverImage`: en POST significa "sin portada" y en PUT "no cambiar".
 */
export async function uploadBlogCover({
  title,
  cover,
  presignCover,
  onProgress,
}: UploadBlogCoverParams): Promise<string | null> {
  if (!cover) return null;

  onProgress?.("Uploading cover...");
  const contentType = resolveImageContentType(cover);
  const signed = await presignCover(title, contentType);
  if (!signed.ok) {
    throw new Error(signed.error);
  }
  return uploadImageToR2(cover, signed.data);
}
