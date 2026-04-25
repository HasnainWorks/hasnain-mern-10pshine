import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";
const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

export default function PinnedView({ token, onSelectNote }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPinned = async () => {
      try {
        const res = await fetch(`${API}/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNotes(data.filter((n) => n.isPinned));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPinned();
  }, []);

  if (loading) return (
    <div className="p-8">
      <p className="text-white/20 text-sm animate-pulse">Loading...</p>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Workspace</p>
        <h1 className="text-3xl font-black tracking-tight">Pinned</h1>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">⊹</div>
          <p className="text-white/30 text-sm">No pinned notes.</p>
          <p className="text-white/15 text-xs">Pin a note from All Notes to see it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {notes.map((note, i) => (
            <div
              key={note._id}
              onClick={() => onSelectNote(note)}
              className="group bg-[#161616] border border-[#CAFF00]/20 hover:border-[#CAFF00]/40 rounded-xl p-5 cursor-pointer hover:bg-[#1a1a1a] transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#CAFF00] text-xs">⊹</span>
                <h3 className="font-bold text-sm leading-snug truncate">{note.title}</h3>
              </div>
              <p className="text-white/35 text-xs leading-relaxed line-clamp-3 mb-3">
                {stripHtml(note.content) || "No content"}
              </p>
              {note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}