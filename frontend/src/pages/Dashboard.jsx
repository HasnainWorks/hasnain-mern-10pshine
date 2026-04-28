import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotesGrid from "../components/notes/NotesGrid";
import PinnedView from "../components/PinnedView";
import TagsView from "../components/TagsView";
import TrashView from "../components/TrashView";
import NoteEditor from "../pages/NoteEditor";
import ImportNote from "../components/notes/ImportNote";


export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [activeSection, setActiveSection] = useState("notes");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [importedNote, setImportedNote] = useState(null);

  const handleLogout = () => { logout(); navigate("/login"); };
  const openNew = () => { setSelectedNote(null); setShowEditor(true); };
  const openEdit = (note) => { setSelectedNote(note); setShowEditor(true); };
 const handleSave = () => {
  setShowEditor(false);
  setImportedNote(null);
  setRefreshKey((k) => k + 1);
};

const handleEditorClose = () => {
  setShowEditor(false);
  setImportedNote(null);
};

const handleImport = ({ title, content }) => {
  setImportedNote({ title, content });
  setSelectedNote(null);
  setShowEditor(true);
};

  const navItems = [
    { id: "notes",  label: "All Notes", icon: "✦" },
    { id: "pinned", label: "Pinned",    icon: "⊹" },
    { id: "tags",   label: "Tags",      icon: "◈" },
    { id: "trash",  label: "Trash",     icon: "⊗" },
  ];

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-white overflow-hidden font-sans">

      {/* Sidebar */}
      <aside className="w-60 border-r border-white/[0.07] flex flex-col py-6 px-4 shrink-0">
        <div className="flex items-center gap-2.5 mb-10 px-2">
          <div className="bg-[#CAFF00] text-black w-7 h-7 rounded flex items-center justify-center font-black text-sm">→</div>
          <span className="font-black text-lg tracking-tight">Noted.</span>
        </div>

       <div className="flex flex-col gap-2 mb-6">
  <button
    onClick={openNew}
    className="w-full bg-[#CAFF00] hover:bg-[#b8e600] text-black text-sm font-bold py-2.5 rounded-lg transition-colors"
  >
    + New Note
  </button>
  <ImportNote onImport={handleImport} />
</div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === item.id
                  ? "bg-[#CAFF00] text-black"
                  : "text-white/50 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/[0.07] pt-4 px-2">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2.5 mb-2 w-full hover:opacity-80 transition-opacity text-left"
          >
            <div className="w-7 h-7 rounded-full bg-[#CAFF00] text-black flex items-center justify-center font-black text-xs shrink-0">
              {(user?.name || user?.email || "U")[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate leading-tight">{user?.name || user?.email}</p>
              <p className="text-xs text-white/30 truncate">{user?.email || ""}</p>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-white/30 hover:text-[#CAFF00] transition-colors mt-1"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {activeSection === "notes" && (
          <NotesGrid key={refreshKey} token={token} onSelectNote={openEdit} />
        )}
        {activeSection === "pinned" && (
          <PinnedView token={token} onSelectNote={openEdit} />
        )}
        {activeSection === "tags" && (
          <TagsView token={token} onSelectNote={openEdit} />
        )}
        {activeSection === "trash" && (
          <TrashView token={token} />
        )}
      </main>

      {/* Editor */}
      {showEditor && (
  <NoteEditor
    token={token}
    note={selectedNote}
    importedData={importedNote}
    onSave={handleSave}
    onClose={handleEditorClose}
  />
)}
    </div>
  );
}