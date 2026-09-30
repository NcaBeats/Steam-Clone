/**
 * Contratos del flujo de subida directa (presign). El navegador pide la firma al
 * backend por Server Action, sube los bytes straight al storage y despues manda
 * solo las URLs, de modo que ningun archivo atraviesa Vercel.
 */

export type MediaKind = "image" | "banner" | "gallery";

/**
 * Respuesta de presign del backend (tanto para imagen como para video). El
 * navegador debe hacer PUT contra uploadUrl enviando contentType verbatim,
 * ya que la firma cubre la cabecera: un valor distinto produce 403.
 */
export type PresignedUploadResponse = {
  uploadUrl: string;
  key: string;
  publicPath: string;
  contentType: string;
  expiresInSeconds: number;
};

/** URLs ya alojadas. Los campos ausentes o vacios conservan el valor actual. */
export type GameMediaUrls = {
  videoUrl?: string;
  imageUrl?: string;
  bannerUrl?: string;
  galleryUrls?: string[];
};
