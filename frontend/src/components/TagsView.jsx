import { useEffect, useState } from "react";
import api from "../services/api";

const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

export default function TagsView({ onSelectNote }) {
  const [notes, setNotes] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get("/notes");
        setNotes(data.notes || data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const allTags = [...new Set(notes.flatMap((n) => n.tags || []))];
  const filtered = selectedTag
    ? notes.filter((n) => n.tags?.includes(selectedTag))
    : [];

  if (loading) return (
    <div className="p-8">
      <p className="text-white/20 text-sm animate-pulse">Loading...</p>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Workspace</p>
        <h1 className="text-3xl font-black tracking-tight">Tags</h1>
      </div>

      {allTags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">◈</div>
          <p className="text-white/30 text-sm">No tags yet.</p>
          <p className="text-white/15 text-xs">Add tags to your notes from the editor</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-8">
            {allTags.map((tag) => {
              const count = notes.filter((n) => n.tags?.includes(tag)).length;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                    selectedTag === tag
                      ? "bg-[#CAFF00] text-black font-bold"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  #{tag}
                  <span className={`text-[10px] ${selectedTag === tag ? "text-black/60" : "text-white/30"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedTag && (
            <>
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
                {filtered.length} note{filtered.length !== 1 ? "s" : ""} tagged #{selectedTag}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => onSelectNote(note)}
                    className="bg-[#161616] border border-white/[0.07] hover:border-[#CAFF00]/40 rounded-xl p-5 cursor-pointer hover:bg-[#1a1a1a] transition-all"
                  >
                    <h3 className="font-bold text-sm mb-2">{note.title}</h3>
                    <p className="text-white/35 text-xs line-clamp-3">
                      {stripHtml(note.content) || "No content"}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}