export type MediaKind = "image" | "banner" | "gallery";

export type PresignedUploadResponse = {
  uploadUrl: string;
  key: string;
  publicPath: string;
  contentType: string;
  expiresInSeconds: number;
};

export type GameMediaUrls = {
  videoUrl?: string;
  imageUrl?: string;
  bannerUrl?: string;
  galleryUrls?: string[];
};
