export const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

export function highlight(text, query) {
  if (!query.trim()) return text;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-[#CAFF00]/30 text-white rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}