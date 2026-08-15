import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import Image from "next/image";
import LikeButton from "@/components/like-button";
import Link from "next/link";
import Comments from "@/components/comments";
import Navbar from "@/components/navbar";
import LiveVideo from "@/components/live-video";
import FollowButton from "@/components/follow-button";
import CreatePost from "@/components/create-post";

async function createPost(formData: FormData) {
  "use server";

  const content = formData.get("content")?.toString().trim();
  const image = formData.get("image") as File | null;

  if (!content && (!image || image.size === 0)) {
    return;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  let imageUrl: string | null = null;

  if (image && image.size > 0) {
    // Get a proper extension from the MIME type
    const mimeType = image.type || "image/jpeg";

    const extensionMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
    };

    const extension = extensionMap[mimeType] || "jpg";

    const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, image, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("IMAGE UPLOAD ERROR:", uploadError);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    imageUrl = publicUrl;
  }

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    content: content || "",
    image_url: imageUrl,
  });

  if (error) {
    console.error("POST INSERT ERROR:", error);
    return;
  }

  revalidatePath("/protected");
}

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type CommentProfile = {
  username: string | null;
  full_name: string | null;
};

type CommentData = {
  id: string;
  content: string;
  user_id: string;
  profiles: CommentProfile | null;
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

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: posts, error } = await supabase
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
          username,
          full_name
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("POSTS ERROR:", error);
  }

  const normalizedPosts: PostData[] = (posts ?? []).map(
    (post): PostData => ({
      id: post.id,
      content: post.content,
      image_url: post.image_url,
      created_at: post.created_at,
      user_id: post.user_id,

      profiles: Array.isArray(post.profiles)
        ? post.profiles[0] ?? null
        : post.profiles,

      likes: (post.likes ?? []).map((like) => ({
        user_id: like.user_id,
      })),

      comments: (post.comments ?? []).map(
        (comment): CommentData => {
          const profile = Array.isArray(comment.profiles)
            ? comment.profiles[0] ?? null
            : comment.profiles;

          return {
            id: comment.id,
            content: comment.content,
            user_id: comment.user_id,
            profiles: profile
              ? {
                  username: profile.username,
                  full_name: profile.full_name,
                }
              : null,
          };
        }
      ),
    })
  );

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0B1F3A]">
      <Navbar />

      {/* BREAKING NEWS TICKER */}
      <div className="w-full overflow-hidden border-b border-red-200 bg-red-600 text-white">
        <div className="flex h-9 items-center">
          <div className="z-10 flex h-full shrink-0 items-center bg-red-700 px-4 text-xs font-black tracking-widest">
            🚨 BREAKING
          </div>

          <div className="overflow-hidden whitespace-nowrap">
            <div className="animate-[marquee_25s_linear_infinite] inline-block text-xs font-semibold">
              🚨 BREAKING • FOOD SHORTAGE AT DDC RESULTS IN MASS OUTRAGE
              {" • "}
              CHANNAY KHAYTAM, PURI KHATAM SAB KHATAM
              {" • "}
              DHAES TO PRESENT IN HIGH COURT TOMORROW
              {" • "}
              ONLY SALAD LEFT, NO FOOD
              {" • "}
              "DHA IS A DISGRACE TO HUMANITY", John Elia
              {" • "}
              DHAES HELD ACCOUNTABLE FOR MASS STARVATION
              {" • "}
              FOOD SHORTAGE AT DDC RESULTS IN MASS OUTRAGE
              {" • "}
              CHANNAY KHAYTAM, PURI KHATAM SAB KHATAM
              {" • "}
              DHAES TO PRESENT IN HIGH COURT TOMORROW
            </div>
          </div>
        </div>
      </div>

      <section className="min-w-0 flex-1">
        {/* NEWS CHANNEL HEADER */}
        <div className="mb-6 border-b-4 border-[#0B1F3A] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 animate-pulse rounded-full bg-red-600" />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  LIVE BROADCAST
                </span>
              </div>

              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                DOGLA NEWS NETWORK
              </h1>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Dogla News Network • DNN
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold text-slate-400">
                ON AIR
              </p>

              <p className="text-sm font-black text-[#0B1F3A]">
                24/7*
              </p>

              <p className="text-[10px] text-slate-400">
                *not actually
              </p>
            </div>
          </div>
        </div>

        {/* INTRO / LIVE VIDEO */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-xl">
          <div className="flex items-center justify-between bg-[#0B1F3A] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />

              <span className="text-xs font-black tracking-widest">
                LIVE
              </span>
            </div>

            <span className="text-xs font-bold tracking-widest text-slate-300">
              DNN • CHANNEL 01
            </span>
          </div>

          <LiveVideo />

          <div className="bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#2F80ED]">
                  SPECIAL REPORT
                </p>

                <h2 className="mt-1 text-xl font-black text-[#0B1F3A]">
                  Meet the Team
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  Get to know the highly professional journalists behind
                  the most questionably reliable news network in town.
                </p>
              </div>

              <div className="rounded-lg bg-slate-100 px-3 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  STATUS
                </p>

                <p className="text-sm font-black text-green-600">
                  ON AIR
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DEVELOPING STORY */}
        <div className="mb-8 overflow-hidden rounded-xl border border-yellow-300 bg-yellow-50">
          <div className="flex items-center gap-3 border-b border-yellow-200 bg-yellow-100 px-4 py-2">
            <span className="text-xs font-black uppercase tracking-widest text-yellow-800">
              ⚠ DEVELOPING STORY
            </span>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-black text-[#0B1F3A]">
              O Level CAIES Results incoming
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Sources close to the situation claim that students are
              extremely nervous and some psychopaths are happy.
            </p>

            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              This story is developing • DNN
            </p>
          </div>
        </div>

        {/* CREATE POST */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

              <p className="text-xs font-black uppercase tracking-widest text-red-600">
                REPORT LIVE
              </p>
            </div>

            <h2 className="mt-1 text-xl font-black text-[#0B1F3A]">
              Share breaking news
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Jhoot, imaandari ke sath.
            </p>
          </div>

          <CreatePost action={createPost} />
        </div>

        {/* FEED HEADER */}
        <div className="mb-4 flex items-end justify-between border-b border-slate-200 pb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-red-600">
              Latest Reports
            </p>

            <h2 className="text-xl font-black text-[#0B1F3A]">
              Community News
            </h2>
          </div>

          <span className="text-xs font-bold text-slate-400">
            DNN FEED
          </span>
        </div>

        {/* FEED */}
        <div className="space-y-4">
          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              Could not load posts.
            </p>
          )}

          {normalizedPosts.map((post) => (
            <article
              id={`post-${post.id}`}
              key={post.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* POST HEADER */}
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <Link href={`/profiles/${post.profiles?.id}`}>
                    {post.profiles?.avatar_url ? (
                      <Image
                        width={11}
                        height={11}
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

                  {/* Author */}
                  <div className="min-w-0">
                    <Link
                      href={`/profile/${post.profiles?.id}`}
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

                  {/* Follow button */}
                  {post.user_id !== user.id && post.profiles?.id && (
                    <div className="ml-auto">
                      <FollowButton profileId={post.profiles.id} />
                    </div>
                  )}

                  {/* New report badge */}
                  <div className="hidden rounded bg-red-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-red-600 sm:block">
                    NEW REPORT
                  </div>
                </div>
              </div>

              {/* POST CONTENT */}
              <div className="p-6">
                <p className="whitespace-pre-wrap text-[16px] leading-7 text-slate-700">
                  {post.content}
                </p>

                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post image"
                    loading="lazy"
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
            <div className="rounded-xl border bg-white p-8 text-center">
              <p className="text-gray-500">
                No reports yet. Be the first journalist! 🎤
              </p>
            </div>
          )}
        </div>

        {/* DISCLAIMER */}
        <div className="mt-8 border-t border-slate-200 pt-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            DOGla NEWS NETWORK
          </p>

          <p className="mt-1 text-xs text-slate-400">
            All reports are part of a farewell roleplay and are
            absolutely not real news. Probably.
          </p>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </main>
  );
}