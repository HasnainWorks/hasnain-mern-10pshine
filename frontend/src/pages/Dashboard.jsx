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
  const [activeSection, setActiveSection] = useState("notes");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [importedNote, setImportedNote] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };
  const openNew = () => { setSelectedNote(null); setImportedNote(null); setShowEditor(true); };
  const openEdit = (note) => { setSelectedNote(note); setShowEditor(true); };
  const handleSave = () => { setShowEditor(false); setImportedNote(null); setRefreshKey((k) => k + 1); };
  const handleEditorClose = () => { setShowEditor(false); setImportedNote(null); };
  const handleImport = ({ title, content }) => { setImportedNote({ title, content }); setSelectedNote(null); setShowEditor(true); };

  const navItems = [
    { id: "notes", label: "All Notes", icon: "✦" },
    { id: "pinned", label: "Pinned", icon: "⊹" },
    { id: "tags", label: "Tags", icon: "◈" },
    { id: "trash", label: "Trash", icon: "⊗" },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-white overflow-hidden font-sans">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 border-r border-white/[0.07] flex flex-col py-6 px-4 shrink-0
        bg-[#0e0e0e] transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#CAFF00] text-black w-7 h-7 rounded flex items-center justify-center font-black text-sm">→</div>
            <span className="font-black text-lg tracking-tight">Noted.</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/30 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <button
            onClick={() => { openNew(); setSidebarOpen(false); }}
            className="w-full bg-[#CAFF00] hover:bg-[#b8e600] text-black text-sm font-bold py-2.5 rounded-lg transition-colors"
          >
            + New Note
          </button>
          <ImportNote onImport={(data) => { handleImport(data); setSidebarOpen(false); }} />
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
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
            onClick={() => { navigate("/profile"); setSidebarOpen(false); }}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-[#CAFF00] text-black w-6 h-6 rounded flex items-center justify-center font-black text-xs">→</div>
            <span className="font-black text-base tracking-tight">Noted.</span>
          </div>
          <button
            onClick={openNew}
            className="w-9 h-9 rounded-lg bg-[#CAFF00] flex items-center justify-center text-black font-black text-lg"
          >
            +
          </button>
        </div>

        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1">
            {activeSection === "notes" && (
              <NotesGrid key={refreshKey} onSelectNote={openEdit} />
            )}
            {activeSection === "pinned" && (
              <PinnedView onSelectNote={openEdit} />
            )}
            {activeSection === "tags" && (
              <TagsView onSelectNote={openEdit} />
            )}
            {activeSection === "trash" && (
              <TrashView />
            )}
          </div>
          
        </main>
      </div>

      {showEditor && (
        <NoteEditor
          note={selectedNote}
          importedData={importedNote}
          onSave={handleSave}
          onClose={handleEditorClose}
        />
      )}
    </div>
  );
}