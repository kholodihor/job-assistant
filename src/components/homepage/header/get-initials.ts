export const getInitials = (
  name: string | null | undefined,
  fallback = "??"
) => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  return parts
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase())
    .join("");
};
