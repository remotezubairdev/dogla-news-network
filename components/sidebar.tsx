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
        <Link
          href="/following"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-[#0B1F3A]"
        >
          Following Reporters
        </Link>

      </div>
    </aside>
  );
}