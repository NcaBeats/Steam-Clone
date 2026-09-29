/**
 * Contratos del flujo de subida directa (presign). El navegador pide la firma al
 * backend por Server Action, sube los bytes straight al storage y despues manda
 * solo las URLs, de modo que ningun archivo atraviesa Vercel.
 */

export type MediaKind = "image" | "banner" | "gallery";

export type VideoPresignResponse = {
  uploadUrl: string;
  key: string;
  publicPath: string;
  contentType: string;
  expiresInSeconds: number;
};

export type SignedImageUpload = {
  uploadUrl: string;
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
};

/** URLs ya alojadas. Los campos ausentes o vacios conservan el valor actual. */
export type GameMediaUrls = {
  videoUrl?: string;
  imageUrl?: string;
  bannerUrl?: string;
  galleryUrls?: string[];
};
