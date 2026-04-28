import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API = "http://localhost:5000/api";

export default function DangerZone({ token }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/auth/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete account");
      logout();
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="border border-red-500/20 rounded-2xl p-6 bg-red-500/[0.03]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-black text-sm text-red-400 mb-1">Danger Zone</h3>
          <p className="text-white/30 text-xs">
            Permanently delete your account and all notes. This cannot be undone.
          </p>
        </div>
        <button
          onClick={() => setShowDelete((s) => !s)}
          className="text-xs px-3 py-1.5 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors shrink-0 ml-4"
        >
          {showDelete ? "Cancel" : "Delete Account"}
        </button>
      </div>

      {showDelete && (
        <div className="space-y-3 pt-3 border-t border-red-500/10">
          <p className="text-white/40 text-xs">
            Type{" "}
            <span className="text-red-400 font-mono font-bold">DELETE</span>{" "}
            to confirm
          </p>
          <input
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full bg-[#0e0e0e] border border-red-500/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/40 transition-colors placeholder-white/20"
          />
          <button
            onClick={handleDelete}
            disabled={deleteConfirm !== "DELETE" || deleting}
            className="w-full py-2.5 bg-red-500 text-white text-sm font-black rounded-xl hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {deleting ? "Deleting..." : "Permanently Delete My Account"}
          </button>
        </div>
      )}
    </div>
  );
}