export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0e0e0e] px-6 py-5">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 sm:flex-row sm:justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-[#CAFF00] text-black w-5 h-5 rounded flex items-center justify-center font-black text-xs">
            →
          </div>
          <span className="font-black text-sm tracking-tight">Noted.</span>
          <span className="text-white/20 text-xs font-mono hidden sm:inline">· Your thoughts, organized</span>
        </div>

        {/* Copyright */}
        <p className="text-white/20 text-xs font-mono text-center">
          © {new Date().getFullYear()} Noted. All rights reserved.
        </p>

        {/* Tech Stack */}
        <div className="flex items-center gap-2">
          {["React", "Node.js", "MongoDB"].map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/[0.06]"
            >
              {tech}
            </span>
          ))}
        </div>

      </div>
    </footer>
  );
}