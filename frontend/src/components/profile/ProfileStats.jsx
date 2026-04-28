export default function ProfileStats({ stats }) {
  const items = [
    { label: "Total Notes", value: stats?.totalNotes ?? 0, icon: "✦" },
    { label: "Pinned", value: stats?.pinnedNotes ?? 0, icon: "⊹" },
    { label: "In Trash", value: stats?.trashedNotes ?? 0, icon: "⊗" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-10">
      {items.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#161616] border border-white/[0.07] rounded-xl p-4 text-center"
        >
          <p className="text-[#CAFF00] text-xs font-mono mb-2">{stat.icon}</p>
          <p className="text-2xl font-black">{stat.value}</p>
          <p className="text-white/30 text-xs mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}