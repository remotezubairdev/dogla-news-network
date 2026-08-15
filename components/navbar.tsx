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

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700 bg-[#0B1F3A] text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Brand */}
        <Link
          href="/protected"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xs font-black tracking-tight text-[#0B1F3A]">
            DN
          </div>

          <div className="leading-none">
            <div className="text-lg font-black tracking-tight">
              DOGLA
            </div>

            <div className="mt-1 text-[9px] font-bold tracking-[0.25em] text-blue-200">
              NEWS NETWORK
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2">
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

          {/* Notifications */}
          {userId && (
            <NotificationsBell userId={userId} />
          )}

          <button
            onClick={logout}
            className="ml-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0B1F3A] transition hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
