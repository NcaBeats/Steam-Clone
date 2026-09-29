import type {
  GameMediaUrls,
  MediaKind,
  SignedImageUpload,
  VideoPresignResponse,
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
  presign: VideoPresignResponse,
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

export async function uploadImageToCloudinary(
  file: File,
  signed: SignedImageUpload,
): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  data.append("api_key", signed.apiKey);
  data.append("timestamp", String(signed.timestamp));
  data.append("signature", signed.signature);
  data.append("folder", signed.folder);

  const res = await fetch(signed.uploadUrl, { method: "POST", body: data });
  if (!res.ok) {
    throw new Error(`Image upload failed (${res.status})`);
  }
  const json = (await res.json()) as { secure_url?: string };
  if (!json.secure_url) {
    throw new Error("Image upload did not return a URL");
  }
  return json.secure_url;
}

export type PresignResult<T> =
  { ok: true; data: T } | { ok: false; error: string };

export type PresignVideoFn = (
  name: string,
  contentType: string,
) => Promise<PresignResult<VideoPresignResponse>>;

export type PresignImageFn = (
  name: string,
  kind: MediaKind,
) => Promise<PresignResult<SignedImageUpload>>;

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
    const signed = unwrap(await presignImage(name, "image"));
    media.imageUrl = await uploadImageToCloudinary(image, signed);
  }

  if (banner) {
    onProgress?.("Uploading banner...");
    const signed = unwrap(await presignImage(name, "banner"));
    media.bannerUrl = await uploadImageToCloudinary(banner, signed);
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
    // La firma de Cloudinary solo cubre timestamp y folder, asi que una sola
    // firma alcanza para todas las imagenes de la galeria.
    const signed = unwrap(await presignImage(name, "gallery"));
    onProgress?.(`Uploading ${gallery.length} gallery images...`);
    const urls: string[] = [];
    for (const file of gallery) {
      urls.push(await uploadImageToCloudinary(file, signed));
    }
    media.galleryUrls = urls;
  }

  return media;
}
