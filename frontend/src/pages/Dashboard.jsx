import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotesGrid from "../components/NotesGrid";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [activeSection, setActiveSection] = useState("notes");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
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

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 px-2">
          <div className="bg-[#CAFF00] text-black w-7 h-7 rounded flex items-center justify-center font-black text-sm">
            →
          </div>
          <span className="font-black text-lg tracking-tight">Noted.</span>
        </div>

        {/* New Note Button */}
        <button
          onClick={() => alert("Editor coming next!")}
          className="w-full bg-[#CAFF00] hover:bg-[#b8e600] text-black text-sm font-bold py-2.5 rounded-lg mb-6 transition-colors"
        >
          + New Note
        </button>

        {/* Nav */}
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

        {/* User — profile slot ready for later */}
        <div className="border-t border-white/[0.07] pt-4 px-2">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2.5 mb-2 w-full hover:opacity-80 transition-opacity text-left"
          >
            <div className="w-7 h-7 rounded-full bg-[#CAFF00] text-black flex items-center justify-center font-black text-xs shrink-0">
              {(user?.name || user?.email || "U")[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate leading-tight">
                {user?.name || user?.email || "User"}
              </p>
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
      <main className="flex-1 overflow-y-auto">
        {activeSection === "notes" && (
          <NotesGrid
            key={refreshKey}
            token={token}
            onSelectNote={(note) => console.log("selected", note)}
          />
        )}
        {activeSection !== "notes" && (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/20 text-sm tracking-widest uppercase">Coming soon</p>
          </div>
        )}
      </main>

    </div>
  );
}