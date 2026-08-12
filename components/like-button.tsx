"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LikeButtonProps = {
  postId: string;
  userId: string;
  initialLikes: string[];
};

export default function LikeButton({
  postId,
  userId,
  initialLikes,
}: LikeButtonProps) {
  const supabase = createClient();

  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const liked = likes.includes(userId);

  async function toggleLike() {
    if (loading) return;

    setLoading(true);

    if (liked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (!error) {
        setLikes((current) =>
          current.filter((id) => id !== userId)
        );
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({
          post_id: postId,
          user_id: userId,
        });

      if (!error) {
        setLikes((current) => [...current, userId]);
      }
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`mt-5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
  liked
    ? "bg-blue-50 font-semibold text-[#2F80ED]"
    : "text-slate-500 hover:bg-slate-100"
}`}
    >
      <span>{liked ? "❤️" : "♡"}</span>
      <span>{likes.length}</span>
    </button>
  );
}