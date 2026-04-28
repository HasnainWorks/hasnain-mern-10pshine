export default function Field({ label, children }) {
  return (
    <div>
      <label className="block text-white/30 text-[10px] font-mono uppercase tracking-[0.2em] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}