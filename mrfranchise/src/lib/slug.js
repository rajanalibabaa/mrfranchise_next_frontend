// Convert text → slug
export function slugify(text) {
  return text
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

// Convert slug → text
export function deslugify(slug) {
  return slug
    ?.replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}