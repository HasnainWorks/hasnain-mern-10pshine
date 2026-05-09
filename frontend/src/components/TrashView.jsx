import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import api from "../services/api";

const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

export default function TrashView() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { fetchTrash(); }, []);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/notes/trash");
      setNotes(data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const restore = async (id) => {
    try {
      await api.patch(`/notes/${id}/restore`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/notes/${confirmId}/permanent`);
      setNotes((prev) => prev.filter((n) => n._id !== confirmId));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    } finally {
      setConfirmId(null);
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
                  onClick={() => setConfirmId(note._id)}
                  className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-white/5 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmId && (
        <ConfirmModal
          title="Permanently Delete?"
          message="This note will be gone forever. This action cannot be undone."
          confirmText="Delete Forever"
          confirmColor="red"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}