/* Public URL of an uploaded file. The id never changes for a file
   (replacing a file creates a new id), so these URLs are cached forever. */
export function mediaUrl(id, name) {
  if (!id) return "";
  return name ? `/media/${id}/${encodeURIComponent(name)}` : `/media/${id}`;
}
