import { useState } from "react";

const API = "http://localhost:5000/api";

const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

export default function AiPanel({ token, title, content, onApply, onTagsGenerated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const [summary, setSummary] = useState(null);
  const [assistResult, setAssistResult] = useState(null);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [error, setError] = useState(null);

  const reset = () => {
    setSummary(null);
    setAssistResult(null);
    setSuggestedTags([]);
    setError(null);
  };

  const handleSummarize = async () => {
    reset();
    setLoading("summarize");
    try {
      const res = await fetch(`${API}/ai/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleAssist = async (action) => {
    reset();
    setLoading(action);
    try {
      const res = await fetch(`${API}/ai/assist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAssistResult({ action, text: data.result });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateTags = async () => {
    reset();
    setLoading("tags");
    try {
      const res = await fetch(`${API}/ai/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuggestedTags(data.tags);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const applyAssistResult = () => {
    if (assistResult) {
      onApply(assistResult.text);
      setAssistResult(null);
    }
  };

  const applyTags = () => {
    if (suggestedTags.length > 0) {
      onTagsGenerated(suggestedTags);
      setSuggestedTags([]);
    }
  };

  return (
    <div className="relative">
      {/* AI Toggle Button */}
      <button
        onClick={() => { setOpen((o) => !o); reset(); }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          open
            ? "bg-[#CAFF00] text-black"
            : "bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10"
        }`}
      >
        ✦ AI
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-[#1a1a1a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-[#CAFF00] text-[10px] font-mono uppercase tracking-[0.3em]">AI Assistant</p>
              <p className="text-white/30 text-xs mt-0.5">Powered by Groq</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/20 hover:text-white text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-3">

            {/* Summarize */}
            <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-bold">Summarize</p>
                  <p className="text-white/30 text-xs">Get a quick summary of your note</p>
                </div>
                <button
                  onClick={handleSummarize}
                  disabled={loading === "summarize"}
                  className="px-3 py-1.5 bg-[#CAFF00] text-black text-xs font-black rounded-lg hover:bg-[#d4f95e] disabled:opacity-40 transition-all shrink-0"
                >
                  {loading === "summarize" ? "..." : "Run"}
                </button>
              </div>
              {summary && (
                <div className="mt-2 pt-2 border-t border-white/[0.06]">
                  <p className="text-white/60 text-xs leading-relaxed">{summary}</p>
                </div>
              )}
            </div>

            {/* Writing Assistant */}
            <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-3">
              <p className="text-sm font-bold mb-1">Writing Assistant</p>
              <p className="text-white/30 text-xs mb-3">Enhance your writing with AI</p>
              <div className="flex gap-2">
                {["continue", "improve", "grammar"].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleAssist(action)}
                    disabled={!!loading}
                    className="flex-1 py-1.5 text-[10px] font-bold rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-40 transition-all capitalize"
                  >
                    {loading === action ? "..." : action}
                  </button>
                ))}
              </div>
              {assistResult && (
                <div className="mt-3 pt-2 border-t border-white/[0.06]">
                  <p className="text-white/60 text-xs leading-relaxed line-clamp-4">
                    {assistResult.text}
                  </p>
                  <button
                    onClick={applyAssistResult}
                    className="mt-2 w-full py-1.5 bg-[#CAFF00] text-black text-xs font-black rounded-lg hover:bg-[#d4f95e] transition-all"
                  >
                    Apply to note →
                  </button>
                </div>
              )}
            </div>

            {/* Auto Tags */}
            <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-bold">Auto Tags</p>
                  <p className="text-white/30 text-xs">AI suggests relevant tags</p>
                </div>
                <button
                  onClick={handleGenerateTags}
                  disabled={loading === "tags"}
                  className="px-3 py-1.5 bg-[#CAFF00] text-black text-xs font-black rounded-lg hover:bg-[#d4f95e] disabled:opacity-40 transition-all shrink-0"
                >
                  {loading === "tags" ? "..." : "Generate"}
                </button>
              </div>
              {suggestedTags.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/[0.06]">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {suggestedTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#CAFF00]/10 text-[#CAFF00] border border-[#CAFF00]/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={applyTags}
                    className="w-full py-1.5 bg-[#CAFF00] text-black text-xs font-black rounded-lg hover:bg-[#d4f95e] transition-all"
                  >
                    Add tags to note →
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs font-mono">✗ {error}</p>
            )}

          </div>
        </div>
      )}
    </div>
  );
}