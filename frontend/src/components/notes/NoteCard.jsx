import { highlight, stripHtml } from "./notesUtils.jsx";

export default function NoteCard({ note, index, search, onSelect, onDelete, onPin }) {
  const preview = stripHtml(note.content) || "No content";

  return (
    <div
      onClick={() => onSelect(note)}
      className={`group relative bg-[#161616] border rounded-xl p-5 cursor-pointer hover:bg-[#1a1a1a] transition-all duration-200 ${
        note.isPinned
          ? "border-[#CAFF00]/20 hover:border-[#CAFF00]/40"
          : "border-white/[0.07] hover:border-white/20"
      }`}
    >
      {note.isPinned && (
        <div className="absolute top-3 right-10 w-1.5 h-1.5 rounded-full bg-[#CAFF00]" />
      )}

      <span className="absolute top-4 right-4 text-white/10 font-mono text-xs">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="font-bold text-sm mb-2 pr-6 leading-snug">
        {highlight(note.title, search)}
      </h3>

      <p className="text-white/35 text-xs leading-relaxed line-clamp-3 mb-3">
        {highlight(preview, search)}
      </p>

      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/40"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-white/20 text-xs font-mono">
          {new Date(note.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => onPin(e, note._id)}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
              note.isPinned
                ? "border-[#CAFF00]/40 text-[#CAFF00] bg-[#CAFF00]/10"
                : "border-white/10 text-white/30 hover:border-[#CAFF00]/40 hover:text-[#CAFF00]"
            }`}
          >
            {note.isPinned ? "pinned" : "pin"}
          </button>
          <button
            onClick={(e) => onDelete(e, note._id)}
            className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/30 hover:border-red-400/40 hover:text-red-400 transition-colors"
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
}