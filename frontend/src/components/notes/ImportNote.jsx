import { useRef, useState } from "react";

export default function ImportNote({ onImport }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".txt")) {
      alert("Only .txt files are supported");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const title = file.name
        .replace(/\.txt$/, "")
        .replace(/[-_]/g, " ")
        .trim() || "Imported Note";
      const content = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => `<p>${line}</p>`)
        .join("");
      onImport({ title, content });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/[0.07] rounded-lg text-xs text-white/50 hover:text-white transition-all"
      >
        <span>↑</span>
        Import .txt
      </button>
    </>
  );
}