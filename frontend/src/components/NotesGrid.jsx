import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

export default function NotesGrid({ token, onSelectNote }) {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this note?")) return;
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Workspace</p>
          <h1 className="text-3xl font-black tracking-tight">All Notes</h1>
        </div>
        <span className="text-white/20 text-sm font-mono">{notes.length} notes</span>
      </div>

      {/* Empty State */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">✦</div>
          <p className="text-white/30 text-sm">No notes yet.</p>
          <p className="text-white/15 text-xs">Hit + New Note to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {notes.map((note, i) => (
            <div
              key={note._id}
              onClick={() => onSelectNote(note)}
              className="group relative bg-[#161616] border border-white/[0.07] rounded-xl p-5 cursor-pointer hover:border-[#CAFF00]/40 hover:bg-[#1a1a1a] transition-all duration-200"
            >
              {/* Index number */}
              <span className="absolute top-4 right-4 text-white/10 font-mono text-xs">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="font-bold text-sm mb-2 pr-6 leading-snug">{note.title}</h3>

              <p className="text-white/35 text-xs leading-relaxed line-clamp-3 mb-4">
                {note.content || "No content"}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-white/20 text-xs font-mono">
                  {new Date(note.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </span>
                <button
                  onClick={(e) => deleteNote(e, note._id)}
                  className="text-white/0 group-hover:text-white/30 hover:!text-red-400 text-xs transition-all duration-200"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}