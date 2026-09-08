export function toFile(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}

export function toFileList(formData: FormData): File[] {
  return formData
    .getAll("gallery")
    .filter((f): f is File => f instanceof File && f.size > 0);
}

export function toJsonPart<T>(value: T): Blob {
  return new Blob([JSON.stringify(value)], { type: "application/json" });
}

export function appendMediaFiles(target: FormData, source: FormData): void {
  const banner = toFile(source.get("banner"));
  if (banner) target.append("banner", banner);

  const video = toFile(source.get("video"));
  if (video) target.append("video", video);

  for (const file of toFileList(source)) {
    target.append("gallery", file);
  }
}
