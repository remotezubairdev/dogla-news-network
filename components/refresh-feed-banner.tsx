"use client";

export default function RefreshFeedBanner() {
  return (
    <div className="relative mb-5 overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-r from-[#0B1F3A] via-[#123B68] to-[#0B1F3A] px-4 py-3.5 text-white shadow-lg shadow-blue-900/10">
      {/* Animated glow */}
      <div className="pointer-events-none absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 animate-pulse rounded-full bg-blue-400/20 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 top-1/2 h-24 w-24 -translate-y-1/2 animate-pulse rounded-full bg-cyan-300/10 blur-2xl" />

      <div className="relative flex items-center gap-3">
        {/* Live indicator */}
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
          <span className="absolute h-3 w-3 animate-ping rounded-full bg-cyan-300 opacity-60" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-cyan-300" />
        </div>

        {/* Message */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-black tracking-tight">
              New reports may be available
            </p>

            <span className="hidden rounded-full bg-cyan-300/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-cyan-200 sm:inline-block">
              Live Feed
            </span>
          </div>

          <p className="mt-0.5 text-xs leading-5 text-blue-100/70">
            Refresh the page to see the latest posts and breaking reports.
          </p>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="group flex shrink-0 items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-black text-[#0B1F3A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md active:translate-y-0"
        >
          <svg
            className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"
            />
          </svg>

          <span>Refresh</span>
        </button>
      </div>

      {/* Animated bottom line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full overflow-hidden bg-white/5">
        <div className="h-full w-1/3 animate-[slide_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-150%);
          }

          50% {
            transform: translateX(300%);
          }

          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}