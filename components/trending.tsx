import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Trending() {
  const supabase = await createClient();

  // Get recent posts
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      created_at,
      likes (
        user_id
      )
    `)
    .gte(
      "created_at",
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    )
    .order("created_at", { ascending: false })
    .limit(50);

  // Calculate likes and rank posts
  const trendingPosts = (posts || [])
    .map((post) => ({
      ...post,
      likeCount: post.likes?.length || 0,
    }))
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 5);

  return (
    <aside className="hidden w-64 shrink-0 xl:block">
      <div className="sticky top-24 space-y-5">

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2F80ED]">
              What's happening
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#0B1F3A]">
              Trending
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Popular this week
            </p>
          </div>

          {trendingPosts.length > 0 ? (
            <div className="space-y-5">

              {trendingPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/protected#post-${post.id}`}
                  className="block"
                >
                  <div className="flex gap-3">

                    <span className="text-sm font-bold text-slate-300">
                      {index + 1}
                    </span>

                    <div className="min-w-0">

                      <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800">
                        {post.content || "Photo post"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        ❤️ {post.likeCount}{" "}
                        {post.likeCount === 1 ? "like" : "likes"}
                      </p>

                    </div>

                  </div>
                </Link>
              ))}

            </div>
          ) : (
            <div className="py-5 text-center">
              <p className="text-sm font-medium text-slate-500">
                Nothing trending yet.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Popular stories will appear here.
              </p>
            </div>
          )}

        </div>

        <div className="rounded-2xl bg-[#0B1F3A] p-5 text-white">

          <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
            Dogla News Network
          </p>

          <p className="mt-2 text-sm leading-6 text-blue-100">
            A place for dogla news network members to share breaking news.
          </p>

        </div>

      </div>
    </aside>
  );
}