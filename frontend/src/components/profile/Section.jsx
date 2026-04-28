export default function Section({ title, subtitle, children }) {
  return (
    <div className="bg-[#161616] border border-white/[0.07] rounded-2xl p-6 mb-4">
      <div className="mb-5">
        <h3 className="font-black text-sm tracking-tight mb-0.5">{title}</h3>
        <p className="text-white/30 text-xs">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}