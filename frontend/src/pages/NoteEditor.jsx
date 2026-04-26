import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import ExportMenu from "../components/notes/ExportMenu";

const API = "http://localhost:5000/api";

const ToolbarBtn = ({ onClick, active, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-all ${
      active
        ? "bg-[#CAFF00] text-black"
        : "text-white/50 hover:text-white hover:bg-white/10"
    }`}
  >
    {children}
  </button>
);

export default function NoteEditor({ token, note, onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const isEditing = !!note;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
    ],
    content: note?.content || "",
    onUpdate: () => {
      setIsDirty(true);
      setSaveStatus("idle");
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-full px-8 py-6 text-sm leading-relaxed text-white/80",
      },
    },
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setTags(note.tags || []);
      editor?.commands.setContent(note.content || "");
    } else {
      setTitle("");
      setTags([]);
      editor?.commands.clearContent();
    }
    setIsDirty(false);
    setSaveStatus("idle");
  }, [note]);

  const handleSave = useCallback(async (silent = false) => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (silent && !isDirty) return;

    setSaving(true);
    setSaveStatus("saving");
    setError(null);

    try {
      const content = editor?.getHTML() || "";
      const url = isEditing ? `${API}/notes/${note._id}` : `${API}/notes`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tags }),
      });

      if (!res.ok) throw new Error("Failed to save note");
      const saved = await res.json();

      setSaveStatus("saved");
      setIsDirty(false);

      if (!silent) onSave(saved, isEditing);

      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("error");
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [title, tags, isDirty, editor, isEditing, note, token, onSave]);

 useEffect(() => {
  const interval = setInterval(() => {
    if (isEditing) handleSave(true);
  }, 30000);
  return () => clearInterval(interval);
}, [handleSave, isEditing]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave(false);
      }
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, isDirty]);

  const handleClose = () => {
    if (isDirty) {
      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirm) return;
    }
    onClose();
  };

  const addTag = (raw) => {
    const newTag = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
      setIsDirty(true);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
    setIsDirty(true);
  };

  const wordCount = editor?.getText().trim().split(/\s+/).filter(Boolean).length || 0;
  const charCount = editor?.getText().length || 0;

  const statusLabel = () => {
    if (saveStatus === "saving") return "Saving...";
    if (saveStatus === "saved") return "✓ Saved";
    if (saveStatus === "error") return "✗ Save failed";
    if (isDirty) return "Unsaved changes";
    return isEditing ? "All changes saved" : "New note";
  };

  const statusColor = () => {
    if (saveStatus === "saved") return "text-[#CAFF00]";
    if (saveStatus === "error") return "text-red-400";
    if (isDirty) return "text-yellow-400/60";
    return "text-white/20";
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e] flex flex-col">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#CAFF00] text-black w-6 h-6 rounded flex items-center justify-center font-black text-xs">
            →
          </div>
          <p className="text-[#CAFF00] text-[10px] font-mono uppercase tracking-[0.3em]">
            {isEditing ? "Editing note" : "New note"}
          </p>
        </div>
       <div className="flex items-center gap-4">
  <span className="text-white/20 text-xs font-mono">
    {wordCount} words · {charCount} chars
       </span>
        {isEditing && <ExportMenu note={note} />}
     <span className="text-xs font-mono text-white/20 hidden sm:block">
        Ctrl+S to save · Esc to close
     </span>
    <button
       onClick={handleClose}
       className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all text-xs"
    >
    ✕
    </button>
     </div>
      </div>

      {/* Title */}
      <div className="px-8 pt-8 pb-3 shrink-0">
        <input
          type="text"
          placeholder="Untitled note..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setIsDirty(true);
            setSaveStatus("idle");
          }}
          className="w-full bg-transparent text-4xl font-black placeholder-white/10 focus:outline-none tracking-tight text-white"
        />
        {isEditing && (
          <p className="text-white/20 text-xs font-mono mt-2">
            Last updated ·{" "}
            {new Date(note.updatedAt).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="px-8 pb-3 flex items-center gap-2 flex-wrap shrink-0 min-h-[36px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full bg-[#CAFF00]/10 text-[#CAFF00] border border-[#CAFF00]/20"
          >
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-[#CAFF00]/50 hover:text-[#CAFF00] ml-0.5 leading-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
              e.preventDefault();
              addTag(tagInput);
            }
            if (e.key === "Backspace" && !tagInput && tags.length > 0) {
              removeTag(tags[tags.length - 1]);
            }
          }}
          placeholder={tags.length === 0 ? "Add tags (Enter or comma to add)..." : "Add another..."}
          className="bg-transparent text-xs font-mono text-white/40 placeholder-white/20 focus:outline-none flex-1 min-w-40"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-8 py-2 border-y border-white/[0.06] shrink-0 flex-wrap">
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          active={editor?.isActive("strike")}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleCode().run()}
          active={editor?.isActive("code")}
          title="Inline code"
        >
          {"<>"}
        </ToolbarBtn>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor?.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor?.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor?.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarBtn>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
          title="Bullet list"
        >
          ≡
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList")}
          title="Numbered list"
        >
          1.
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          active={editor?.isActive("blockquote")}
          title="Blockquote"
        >
          "
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          active={editor?.isActive("codeBlock")}
          title="Code block"
        >
          {"{}"}
        </ToolbarBtn>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <ToolbarBtn
          onClick={() => editor?.chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        >
          ↩
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().redo().run()}
          title="Redo (Ctrl+Y)"
        >
          ↪
        </ToolbarBtn>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-white/[0.06] shrink-0 bg-[#0a0a0a]">
        <p className={`text-xs font-mono transition-colors ${statusColor()}`}>
          {statusLabel()}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-white/30 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-6 py-2.5 bg-[#CAFF00] text-black text-sm font-black rounded-xl hover:bg-[#d4f95e] active:scale-[0.98] disabled:opacity-40 transition-all"
          >
            {saving ? "Saving..." : isEditing ? "Update →" : "Create →"}
          </button>
        </div>
      </div>

    </div>
  );
}