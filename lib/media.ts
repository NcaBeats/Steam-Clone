/**
 * Valida que la URL de media que devuelve el backend sea utilizable tal cual.
 *
 * Antes este modulo era el puente entre dos convenciones: el backend guardaba
 * rutas como /uploads/games/{slug}/trailer.mp4 y aca se reconstruian contra
 * NEXT_PUBLIC_R2_PUBLIC_BASE_URL, con un fallback silencioso al origen del API
 * si la variable faltaba. Eso hacia que un dato incompleto se viera como una
 * URL que funcionaba.
 *
 * El backend ya persiste URLs absolutas en todas las columnas de media (se
 * valida en GameService y se normalizan las filas antiguas con
 * MediaUrlNormalizer), asi que el unico trabajo que queda es verificar el
 * invariante y fallar en voz alta si alguna vez se rompe.
 */

/** Lanza si la URL no es absoluta. En dev se admite http; en produccion, https. */
function requireAbsolute(url: string, field: string): string {
  if (/^https?:\/\/\S+$/.test(url)) return url;
  throw new Error(
    `${field} debe ser una URL absoluta (http/https), no una ruta relativa. ` +
      `Recibido: "${url}". El backend ya no debe emitir rutas relativas; ` +
      `si esto aparece, revisar GameService y correr MediaUrlNormalizer.`,
  );
}

/**
 * El trailer del juego. A diferencia de las imagenes, no hay `<Image>` de
 * next/image que exija un src: el reproductor recibe la cadena y falla en
 * silencio con un video invisible. Por eso la validacion es explícita.
 */
export function resolveVideoUrl(src: string | null | undefined): string {
  if (!src) return "";
  return requireAbsolute(src, "videoUrl");
}
