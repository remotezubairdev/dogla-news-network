import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/navbar";
import LikeButton from "@/components/like-button";
import Comments from "@/components/comments";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type CommentData = {
  id: string;
  content: string;
  user_id: string;
  profiles: Profile | null;
};

type PostData = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  profiles: Profile | null;
  likes: {
    user_id: string;
  }[];
  comments: CommentData[];
};

export default async function FollowingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get everyone the current user follows.
  const { data: follows, error: followsError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id);

  if (followsError) {
    console.error("FOLLOWING ERROR:", followsError);
  }

  const followingIds = (follows ?? []).map((follow) => follow.following_id);

  let normalizedPosts: PostData[] = [];

  if (followingIds.length > 0) {
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        image_url,
        created_at,
        user_id,

        profiles!posts_user_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        ),

        likes (
          user_id
        ),

        comments (
          id,
          content,
          user_id,
          profiles!comments_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        )
      `)
      .in("user_id", followingIds)
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error("FOLLOWING POSTS ERROR:", postsError);
    }

    normalizedPosts = (posts ?? []).map((post) => ({
      id: post.id,
      content: post.content,
      image_url: post.image_url,
      created_at: post.created_at,
      user_id: post.user_id,

      profiles: Array.isArray(post.profiles)
        ? post.profiles[0] ?? null
        : post.profiles,

      likes: post.likes ?? [],

      comments: (post.comments ?? []).map((comment) => ({
        id: comment.id,
        content: comment.content,
        user_id: comment.user_id,

        profiles: Array.isArray(comment.profiles)
          ? comment.profiles[0] ?? null
          : comment.profiles,
      })),
    }));
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0B1F3A]">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Page header */}
        <div className="mb-6 border-b-4 border-[#0B1F3A] pb-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
            YOUR NETWORK
          </p>

          <div className="mt-1 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Following
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Posts from people you follow.
              </p>
            </div>

            <Link
              href="/protected"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#0B1F3A] transition hover:bg-slate-50"
            >
              All Posts
            </Link>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {normalizedPosts.map((post) => (
            <article
              id={`post-${post.id}`}
              key={post.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Post header */}
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Link href={`/profiles/${post.profiles?.id}`}>
                    {post.profiles?.avatar_url ? (
                      <img
                        src={post.profiles.avatar_url}
                        alt=""
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0B1F3A] text-sm font-bold text-white">
                        {(
                          post.profiles?.full_name ||
                          post.profiles?.username ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0">
                    <Link
                      href={`/profiles/${post.profiles?.id}`}
                      className="block hover:opacity-80"
                    >
                      <p className="truncate font-bold text-[#0B1F3A]">
                        {post.profiles?.full_name ||
                          post.profiles?.username ||
                          "User"}
                      </p>

                      <p className="text-xs text-slate-500">
                        @{post.profiles?.username || "user"}
                      </p>
                    </Link>
                  </div>

                  <span className="ml-auto rounded bg-blue-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-blue-600">
                    Following
                  </span>
                </div>
              </div>

              {/* Post content */}
              <div className="p-6">
                <p className="whitespace-pre-wrap text-[16px] leading-7 text-slate-700">
                  {post.content}
                </p>

                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post image"
                    className="mt-4 max-h-[600px] w-full rounded-xl object-cover"
                  />
                )}

                <LikeButton
                  postId={post.id}
                  userId={user.id}
                  initialLikes={
                    post.likes?.map((like) => like.user_id) ?? []
                  }
                />

                <Comments
                  postId={post.id}
                  userId={user.id}
                  initialComments={post.comments}
                />

                <p className="mt-4 text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            </article>
          ))}

          {normalizedPosts.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                👥
              </div>

              <h2 className="text-lg font-black text-[#0B1F3A]">
                No posts yet
              </h2>

              {followingIds.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  Follow some people to see their posts here.
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  The people you follow haven't posted anything yet.
                </p>
              )}

              <Link
                href="/protected"
                className="mt-5 inline-flex rounded-lg bg-[#0B1F3A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#123B68]"
              >
                Explore Posts
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
