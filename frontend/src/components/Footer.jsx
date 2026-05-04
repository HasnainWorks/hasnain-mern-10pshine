export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0e0e0e] px-8 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-[#CAFF00] text-black w-5 h-5 rounded flex items-center justify-center font-black text-xs">
            →
          </div>
          <span className="font-black text-sm tracking-tight">Noted.</span>
          <span className="text-white/40 text-xs font-mono">· Your thoughts, organized</span>
        </div>

        {/* Center */}
        <p className="text-white/40 text-xs font-mono">
          © {new Date().getFullYear()} Noted. All rights reserved.
        </p>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-xs">Built with</span>
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

      </div>
    </footer>
  );
}