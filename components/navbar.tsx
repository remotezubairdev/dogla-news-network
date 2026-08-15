"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NotificationsBell from "@/components/notifications-bell";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    }

    getUser();
  }, [supabase]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700 bg-[#0B1F3A] text-white shadow-lg">
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <div className="flex h-[72px] items-center justify-between">
          {/* Brand */}
          <Link
            href="/protected"
            onClick={closeMenu}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[10px] font-black tracking-tight text-[#0B1F3A] sm:h-10 sm:w-10 sm:text-xs">
              DN
            </div>

            <div className="leading-none">
              <div className="text-base font-black tracking-tight sm:text-lg">
                DOGLA
              </div>

              <div className="mt-1 text-[7px] font-bold tracking-[0.2em] text-blue-200 sm:text-[9px] sm:tracking-[0.25em]">
                NEWS NETWORK
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/protected"
              className="rounded-lg px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-white/10 hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/profile"
              className="rounded-lg px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-white/10 hover:text-white"
            >
              Profile
            </Link>

            {userId && <NotificationsBell userId={userId} />}

            <button
              onClick={logout}
              className="ml-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0B1F3A] transition hover:bg-blue-50"
            >
              Logout
            </button>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-1 md:hidden">
            {userId && <NotificationsBell userId={userId} />}

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-white/10"
            >
              {menuOpen ? (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen
              ? "max-h-80 pb-4 opacity-100"
              : "max-h-0 pb-0 opacity-0"
          }`}
        >
          <div className="border-t border-white/10 pt-3">
            <div className="flex flex-col gap-1">
              <Link
                href="/protected"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-blue-100 transition hover:bg-white/10 hover:text-white"
              >
                🏠 Home
              </Link>

              <Link
                href="/profile"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-blue-100 transition hover:bg-white/10 hover:text-white"
              >
                👤 Profile
              </Link>

              <button
                type="button"
                onClick={async () => {
                  closeMenu();
                  await logout();
                }}
                className="mt-2 rounded-xl bg-white px-4 py-3 text-left text-sm font-bold text-[#0B1F3A] transition hover:bg-blue-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
<div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden">
  <div className="mx-auto flex h-[68px] max-w-lg items-center justify-around px-2">
    
    {/* Home */}
    <Link
      href="/protected"
      className="flex min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[#0B1F3A] transition active:scale-95"
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5v-9Z"
        />
      </svg>

      <span className="text-[10px] font-bold">
        Home
      </span>
    </Link>

    {/* Search */}
    <Link
      href="/explore"
      className="flex min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-slate-500 transition active:scale-95"
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m20 20-4-4"
        />
      </svg>

      <span className="text-[10px] font-bold">
        Explore
      </span>
    </Link>

    {/* Create */}
    <Link
      href="/protected?create=true"
      className="flex h-12 w-12 -translate-y-3 items-center justify-center rounded-2xl bg-[#0B1F3A] text-white shadow-lg transition active:scale-90"
      aria-label="Create post"
    >
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 5v14M5 12h14"
        />
      </svg>
    </Link>

    {/* Notifications */}
    <div className="flex min-w-[56px] flex-col items-center justify-center">
      {userId ? (
        <NotificationsBell userId={userId} />
      ) : (
        <div className="h-10 w-10" />
      )}

      <span className="-mt-1 text-[10px] font-bold text-slate-500">
        Alerts
      </span>
    </div>

    {/* Profile */}
    <Link
      href="/profile"
      className="flex min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-slate-500 transition active:scale-95"
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 20a7 7 0 0 1 14 0"
        />
      </svg>

      <span className="text-[10px] font-bold">
        Profile
      </span>
    </Link>
  </div>
</div>
    </nav>
  );
}