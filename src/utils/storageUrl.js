export function getStorageUrl(path) {
  if (!path) return undefined;
  // already a full URL (e.g. freshly uploaded and returned as data.url) — use as-is
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${import.meta.env.STORAGE_URL}/${path}`;
}
