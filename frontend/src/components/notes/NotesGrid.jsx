import { useEffect, useState, useMemo } from "react";
import NoteCard from "./NoteCard";
import SearchBar from "./SearchBar";
import { stripHtml } from "./notesUtils.jsx";
import ConfirmModal from "../ConfirmModal";
import api from "../../services/api";

export default function NotesGrid({ onSelectNote, onNotesChange }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/notes");
      setNotes(data.notes || data);
      onNotesChange?.(data.notes || data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = (e, id) => {
    e.stopPropagation();
    setConfirmDelete(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/notes/${confirmDelete}`);
      setNotes((prev) => prev.filter((n) => n._id !== confirmDelete));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    } finally {
      setConfirmDelete(null);
    }
  };

  const togglePin = async (e, id) => {
    e.stopPropagation();
    try {
      const { data } = await api.patch(`/notes/${id}/pin`);
      setNotes((prev) =>
        prev
          .map((n) => (n._id === id ? data : n))
          .sort((a, b) => b.isPinned - a.isPinned)
      );
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const filtered = useMemo(() => {
    let result = [...notes];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          stripHtml(n.content).toLowerCase().includes(q) ||
          n.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "alpha":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    return result;
  }, [notes, search, sortBy]);

  const pinned = filtered.filter((n) => n.isPinned);
  const unpinned = filtered.filter((n) => !n.isPinned);

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
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Workspace</p>
          <h1 className="text-3xl font-black tracking-tight">All Notes</h1>
        </div>
        <span className="text-white/20 text-sm font-mono">
          {filtered.length}/{notes.length} notes
        </span>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">✦</div>
          <p className="text-white/30 text-sm">No notes yet.</p>
          <p className="text-white/15 text-xs">Hit + New Note to get started</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">⌕</div>
          <p className="text-white/30 text-sm">No results for "{search}"</p>
          <button onClick={() => setSearch("")} className="text-[#CAFF00] text-xs hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        <>
          {pinned.length > 0 && (
            <div className="mb-8">
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">⊹ Pinned</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pinned.map((note, i) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    index={i}
                    search={search}
                    onSelect={onSelectNote}
                    onDelete={deleteNote}
                    onPin={togglePin}
                  />
                ))}
              </div>
            </div>
          )}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">✦ Notes</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unpinned.map((note, i) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    index={i}
                    search={search}
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

      {confirmDelete && (
        <ConfirmModal
          title="Move to Trash?"
          message="This note will be moved to trash. You can restore it later."
          confirmText="Move to Trash"
          confirmColor="red"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}