import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-24 space-y-2">

        <Link
          href="/protected"
          className="flex items-center gap-3 rounded-xl bg-[#0B1F3A] px-4 py-3 text-sm font-semibold text-white"
        >
          <span>🏠</span>
          Home
        </Link>

        <Link
          href="/explore"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-[#0B1F3A]"
        >
          <span>🔎</span>
          Explore
        </Link>

        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-[#0B1F3A]"
        >
          <span>👤</span>
          My Profile
        </Link>

        <div className="my-5 border-t border-slate-200" />

        <p className="px-4 pb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          Categories
        </p>

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-600 hover:bg-white">
          📰 News
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-600 hover:bg-white">
          🌍 Local
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-600 hover:bg-white">
          💻 Technology
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-600 hover:bg-white">
          ⚽ Sports
        </button>

      </div>
    </aside>
  );
}