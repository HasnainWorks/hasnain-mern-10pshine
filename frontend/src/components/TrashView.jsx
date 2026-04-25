import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";
const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

export default function TrashView({ token }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTrash(); }, []);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/notes/trash`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch trash");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const restore = async (id) => {
    try {
      const res = await fetch(`${API}/notes/${id}/restore`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to restore");
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const deletePermanently = async (id) => {
    if (!window.confirm("Permanently delete this note? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API}/notes/${id}/permanent`, {
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
    <div className="p-8">
      <p className="text-white/20 text-sm animate-pulse">Loading...</p>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Workspace</p>
        <h1 className="text-3xl font-black tracking-tight">Trash</h1>
        {notes.length > 0 && (
          <p className="text-white/20 text-xs mt-1">
            {notes.length} deleted note{notes.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">⊗</div>
          <p className="text-white/30 text-sm">Trash is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="group bg-[#161616] border border-white/[0.07] rounded-xl p-5 transition-all"
            >
              <h3 className="font-bold text-sm mb-2 text-white/60">{note.title}</h3>
              <p className="text-white/25 text-xs line-clamp-3 mb-4">
                {stripHtml(note.content) || "No content"}
              </p>
              <p className="text-white/20 text-xs font-mono mb-4">
                Deleted ·{" "}
                {new Date(note.deletedAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => restore(note._id)}
                  className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-[#CAFF00]/10 text-[#CAFF00] hover:bg-[#CAFF00]/20 transition-colors"
                >
                  Restore
                </button>
                <button
                  onClick={() => deletePermanently(note._id)}
                  className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-white/5 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}