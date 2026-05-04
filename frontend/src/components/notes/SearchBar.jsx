export default function SearchBar({ search, setSearch, sortBy, setSortBy }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-8">
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">⌕</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, content or tag..."
          className="w-full bg-[#161616] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#CAFF00]/30 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white text-xs transition-colors"
          >
            ✕
          </button>
        )}
      </div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-[#161616] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white/50 focus:outline-none focus:border-[#CAFF00]/30 transition-colors cursor-pointer w-full sm:w-auto"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="alpha">A → Z</option>
      </select>
    </div>
  );
}