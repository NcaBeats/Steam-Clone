import type {
  GameMediaUrls,
  MediaKind,
  PresignedUploadResponse,
} from "@/types";

/**
 * Solo estos tipos llega el backend (allowlist de R2StorageService). Se deriva
 * de la extension y no de file.type porque algunos navegadores reportan
 * application/octet-stream para .mov, que el backend rechazaria.
 */
const VIDEO_CONTENT_TYPES: Record<string, string> = {
  mp4: "video/mp4",
  m4v: "video/x-m4v",
  webm: "video/webm",
  mov: "video/quicktime",
  qt: "video/quicktime",
};

/**
 * Allowlist de imagenes del backend (R2StorageService). El Content-Type queda
 * firmado en la URL de presign, asi que este valor se reutiliza tanto en la
 * peticion de firma como en el header del PUT.
 */
const IMAGE_CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

const IMAGE_CONTENT_TYPE_PATTERN = /^image\/(png|jpe?g|webp|avif|gif)$/;

export function resolveImageContentType(file: File): string {
  if (IMAGE_CONTENT_TYPE_PATTERN.test(file.type)) {
    return file.type.toLowerCase();
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const resolved = IMAGE_CONTENT_TYPES[ext];
  if (!resolved) {
    throw new Error(`Unsupported image format: .${ext || file.type}`);
  }
  return resolved;
}

export function resolveVideoContentType(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const resolved = VIDEO_CONTENT_TYPES[ext];
  if (!resolved) {
    throw new Error(`Unsupported video format: .${ext || file.type}`);
  }
  return resolved;
}

/**
 * PUT a R2 con la URL prefirmada. El Content-Type tiene que ser exactamente el
 * que el backend firmo (viene en la respuesta), porque la firma cubre la
 * cabecera content-type: cualquier diferencia produce SignatureDoesNotMatch.
 */
export async function uploadVideoToR2(
  file: File,
  presign: PresignedUploadResponse,
): Promise<string> {
  const res = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": presign.contentType },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`Trailer upload failed (${res.status})`);
  }
  return presign.publicPath;
}

export async function uploadImageToR2(
  file: File,
  presign: PresignedUploadResponse,
): Promise<string> {
  const res = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": presign.contentType },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`Image upload failed (${res.status})`);
  }
  return presign.publicPath;
}

export type PresignResult<T> =
  { ok: true; data: T } | { ok: false; error: string };

export type PresignVideoFn = (
  name: string,
  contentType: string,
) => Promise<PresignResult<PresignedUploadResponse>>;

export type PresignImageFn = (
  name: string,
  kind: MediaKind,
  contentType: string,
) => Promise<PresignResult<PresignedUploadResponse>>;

type UploadGameMediaParams = {
  name: string;
  image: File | null;
  banner: File | null;
  video: File | null;
  gallery: File[];
  presignVideo: PresignVideoFn;
  presignImage: PresignImageFn;
  onProgress?: (message: string) => void;
};

function unwrap<T>(result: PresignResult<T>): T {
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.data;
}

/**
 * Sube la media elegida y devuelve las URLs. Solo se pide firma para lo que hay
 * que subir: si el usuario no toca un campo, ese campo no viaja y el backend
 * conserva el valor anterior.
 */
export async function uploadGameMedia({
  name,
  image,
  banner,
  video,
  gallery,
  presignVideo,
  presignImage,
  onProgress,
}: UploadGameMediaParams): Promise<GameMediaUrls> {
  const media: GameMediaUrls = {};

  if (image) {
    onProgress?.("Uploading main image...");
    const contentType = resolveImageContentType(image);
    const signed = unwrap(await presignImage(name, "image", contentType));
    media.imageUrl = await uploadImageToR2(image, signed);
  }

  if (banner) {
    onProgress?.("Uploading banner...");
    const contentType = resolveImageContentType(banner);
    const signed = unwrap(await presignImage(name, "banner", contentType));
    media.bannerUrl = await uploadImageToR2(banner, signed);
  }

  if (video) {
    onProgress?.("Uploading trailer...");
    // El contentType se resuelve antes de firmar y se reutiliza en el PUT, de
    // modo que la cabecera que viaja siempre es la que quedo firmada.
    const contentType = resolveVideoContentType(video);
    const presign = unwrap(await presignVideo(name, contentType));
    media.videoUrl = await uploadVideoToR2(video, presign);
  }

  if (gallery.length > 0) {
    onProgress?.(`Uploading ${gallery.length} gallery images...`);
    const urls: string[] = [];
    for (const file of gallery) {
      // Cada imagen de la galeria lleva su propia firma: la key
      // {slug}/gallery/{uuid}.{ext} forma parte de la URL firmada, asi que no
      // se puede reutilizar una firma para mas de un archivo.
      const contentType = resolveImageContentType(file);
      const signed = unwrap(await presignImage(name, "gallery", contentType));
      urls.push(await uploadImageToR2(file, signed));
    }
    media.galleryUrls = urls;
  }

  return media;
}
