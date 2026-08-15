"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  type: string;
  read: boolean;
  created_at: string;
  actor_id: string | null;
};

type Props = {
  userId: string;
};

export default function NotificationsBell({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    async function loadNotifications() {
      setLoading(true);

      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id, type, read, created_at, actor_id"
        )
        .eq("recipient_id", userId)
        .order("created_at", {
          ascending: false,
        })
        .limit(30);

      if (error) {
        console.error(
          "Failed to load notifications:",
          error
        );

        setLoading(false);
        return;
      }

      setNotifications(data ?? []);
      setLoading(false);
    }

    loadNotifications();
  }, [userId]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  async function markAllRead() {
    const supabase = createClient();

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("recipient_id", userId)
      .eq("read", false);

    if (error) {
      console.error(
        "Failed to mark notifications read:",
        error
      );
      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }

  function notificationText(type: string) {
    switch (type) {
      case "follow":
        return "Someone started following you";

      case "like":
        return "Someone liked your post";

      case "comment":
        return "Someone commented on your post";

      case "poll_vote":
        return "Someone voted on your poll";

      default:
        return "You have a new notification";
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-white/10"
      >
        <svg
          className="h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
  className="
    absolute
    right-0
    z-[100]
    mt-3
    w-[calc(100vw-2rem)]
    max-w-[360px]
    overflow-hidden
    rounded-2xl
    border
    border-slate-200
    bg-white
    text-slate-900
    shadow-2xl
    sm:w-[360px]
  "
>
          <div className="flex items-center justify-between bg-[#0B1F3A] px-4 py-4 text-white">
            <div>
              <p className="text-sm font-black">
                Notifications
              </p>

              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                Dogla activity
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="rounded-lg bg-white/10 px-3 py-2 text-[10px] font-bold hover:bg-white/20"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="mb-3 text-3xl">
                  🔔
                </div>

                <p className="text-sm font-bold text-[#0B1F3A]">
                  No notifications yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Likes, comments and follows will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-slate-100 px-4 py-4 ${
                    notification.read
                      ? "bg-white"
                      : "bg-blue-50"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-lg">
                      {notification.type === "like"
                        ? "❤️"
                        : notification.type === "comment"
                          ? "💬"
                          : notification.type === "follow"
                            ? "👤"
                            : notification.type ===
                                "poll_vote"
                              ? "📊"
                              : "🔔"}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {notificationText(
                          notification.type
                        )}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {new Date(
                          notification.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}