export default function ProfileHeader({ profile }) {
  return (
    <div className="flex items-center gap-5 mb-12">
      <div className="w-16 h-16 rounded-2xl bg-[#CAFF00] text-black flex items-center justify-center font-black text-2xl shrink-0">
        {(profile?.name || "U")[0].toUpperCase()}
      </div>
      <div>
        <h1 className="text-2xl font-black tracking-tight">{profile?.name}</h1>
        <p className="text-white/30 text-sm">{profile?.email}</p>
        <p className="text-white/20 text-xs font-mono mt-1">
          Joined ·{" "}
          {new Date(profile?.joinedAt).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}