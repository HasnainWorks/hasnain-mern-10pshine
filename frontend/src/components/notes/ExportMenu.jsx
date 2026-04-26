import { useState } from "react";

const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

export default function ExportMenu({ note }) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const exportTxt = () => {
    const text = `${note.title}\n${"=".repeat(note.title.length)}\n\n${stripHtml(note.content)}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const exportPdf = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${note.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              max-width: 720px;
              margin: 40px auto;
              padding: 0 24px;
              color: #111;
              line-height: 1.6;
            }
            h1 { font-size: 2rem; font-weight: 900; margin-bottom: 8px; }
            .meta { color: #999; font-size: 12px; margin-bottom: 32px; font-family: monospace; }
            .tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px; }
            .tag { background: #f0f0f0; padding: 2px 10px; border-radius: 99px; font-size: 11px; font-family: monospace; }
            .content { font-size: 15px; }
            .content h1 { font-size: 1.5rem; }
            .content h2 { font-size: 1.25rem; }
            .content blockquote { border-left: 3px solid #CAFF00; padding-left: 16px; color: #555; }
            .content code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
            .content pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; }
            .content ul { padding-left: 24px; list-style: disc; }
            .content ol { padding-left: 24px; list-style: decimal; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <p class="meta">
            Created · ${new Date(note.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            ${note.updatedAt ? ` · Updated · ${new Date(note.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : ""}
          </p>
          ${note.tags?.length > 0 ? `
            <div class="tags">
              ${note.tags.map(t => `<span class="tag">#${t}</span>`).join("")}
            </div>
          ` : ""}
          <div class="content">${note.content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    setOpen(false);
  };

  const copyContent = async () => {
    const text = `${note.title}\n\n${stripHtml(note.content)}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/note/${note._id}`;
    await navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-all"
      >
        <span>↑</span>
        <span>Export / Share</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 z-50 bg-[#1a1a1a] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl w-52">
            <div className="px-3 py-2 border-b border-white/[0.06]">
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
                Export
              </p>
            </div>

            <button
              onClick={exportPdf}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-base">⎙</span>
              Export as PDF
            </button>

            <button
              onClick={exportTxt}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-base">↓</span>
              Export as .txt
            </button>

            <div className="px-3 py-2 border-t border-b border-white/[0.06]">
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
                Share
              </p>
            </div>

            <button
              onClick={copyContent}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-base">⎘</span>
              {copied ? "Copied!" : "Copy content"}
            </button>

            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-base">⊞</span>
              {linkCopied ? "Link copied!" : "Copy link"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}