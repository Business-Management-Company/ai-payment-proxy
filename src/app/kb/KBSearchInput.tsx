"use client";

export function KBSearchInput() {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 mb-12 flex items-center gap-3">
      <span className="text-gray-400 text-lg">🔍</span>
      <input
        type="text"
        placeholder="Search help articles..."
        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
        onInput={(e) => {
          const q = (e.target as HTMLInputElement).value.toLowerCase();
          document.querySelectorAll("[data-article]").forEach((el) => {
            const text = el.textContent?.toLowerCase() || "";
            (el as HTMLElement).style.display = text.includes(q) ? "" : "none";
          });
        }}
      />
    </div>
  );
}
