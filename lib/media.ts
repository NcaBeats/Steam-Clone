function requireAbsolute(url: string, field: string): string {
  if (/^https?:\/\/\S+$/.test(url)) return url;
  throw new Error(
    `${field} debe ser una URL absoluta (http/https), no una ruta relativa. ` +
      `Recibido: "${url}". El backend ya no debe emitir rutas relativas; ` +
      `si esto aparece, revisar GameService y correr MediaUrlNormalizer.`,
  );
}

export function resolveVideoUrl(src: string | null | undefined): string {
  if (!src) return "";
  return requireAbsolute(src, "videoUrl");
}
