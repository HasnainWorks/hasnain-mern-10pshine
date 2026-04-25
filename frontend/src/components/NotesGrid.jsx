import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

export default function NotesGrid({ token, onSelectNote, onNotesChange }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
      onNotesChange?.(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Move to trash?")) return;
    try {
      const res = await fetch(`${API}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const togglePin = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API}/notes/${id}/pin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to pin");
      const updated = await res.json();
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? updated : n))
          .sort((a, b) => b.isPinned - a.isPinned)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-white/20 text-sm animate-pulse">Loading notes...</p>
    </div>
  );

  if (error) return (
    <div className="p-8">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  const pinned = notes.filter((n) => n.isPinned);
  const unpinned = notes.filter((n) => !n.isPinned);

  return (
    <div className="p-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Workspace</p>
          <h1 className="text-3xl font-black tracking-tight">All Notes</h1>
        </div>
        <span className="text-white/20 text-sm font-mono">{notes.length} notes</span>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">✦</div>
          <p className="text-white/30 text-sm">No notes yet.</p>
          <p className="text-white/15 text-xs">Hit + New Note to get started</p>
        </div>
      ) : (
        <>
          {/* Pinned Section */}
          {pinned.length > 0 && (
            <div className="mb-8">
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
                ⊹ Pinned
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pinned.map((note, i) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    index={i}
                    onSelect={onSelectNote}
                    onDelete={deleteNote}
                    onPin={togglePin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Notes Section */}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
                  ✦ Notes
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unpinned.map((note, i) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    index={i}
                    onSelect={onSelectNote}
                    onDelete={deleteNote}
                    onPin={togglePin}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function NoteCard({ note, index, onSelect, onDelete, onPin }) {
  return (
    <div
      onClick={() => onSelect(note)}
      className={`group relative bg-[#161616] border rounded-xl p-5 cursor-pointer hover:bg-[#1a1a1a] transition-all duration-200 ${
        note.isPinned
          ? "border-[#CAFF00]/20 hover:border-[#CAFF00]/40"
          : "border-white/[0.07] hover:border-white/20"
      }`}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-3 right-10 w-1.5 h-1.5 rounded-full bg-[#CAFF00]" />
      )}

      {/* Index */}
      <span className="absolute top-4 right-4 text-white/10 font-mono text-xs">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="font-bold text-sm mb-2 pr-6 leading-snug">{note.title}</h3>

      <p className="text-white/35 text-xs leading-relaxed line-clamp-3 mb-3">
        {stripHtml(note.content) || "No content"}
      </p>

      {/* Tags */}
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
      title={note.isPinned ? "Unpin" : "Pin"}
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