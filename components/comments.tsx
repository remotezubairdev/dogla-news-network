"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  content: string;
  user_id: string;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
};

type CommentsProps = {
  postId: string;
  userId: string;
  initialComments: Comment[];
};

export default function Comments({
  postId,
  userId,
  initialComments,
}: CommentsProps) {
  const supabase = createClient();

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function addComment(e: React.FormEvent) {
    e.preventDefault();

    const text = content.trim();

    if (!text || loading) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content: text,
      })
      .select(`
        id,
        content,
        user_id,
        profiles!comments_user_id_fkey (
          username,
          full_name
        )
      `)
      .single();

    if (!error && data) {
      const newComment: Comment = {
        id: data.id,
        content: data.content,
        user_id: data.user_id,
        profiles: Array.isArray(data.profiles)
          ? data.profiles[0] ?? null
          : data.profiles,
      };

      setComments((current) => [...current, newComment]);
      setContent("");
    }

    if (error) {
      console.error("COMMENT ERROR:", error);
    }

    setLoading(false);
  }

  return (
    <div className="mt-5 border-t pt-4">
      {/* Existing comments */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="text-sm">
            <span className="font-semibold">
              {comment.profiles?.full_name ||
                comment.profiles?.username ||
                "User"}
            </span>

            <span className="ml-2 text-gray-700">
              {comment.content}
            </span>
          </div>
        ))}
      </div>

      {/* Add comment */}
      <form
        onSubmit={addComment}
        className="mt-4 flex gap-2"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          maxLength={500}
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white"
        >
          {loading ? "..." : "Comment"}
        </button>
      </form>
    </div>
  );
}