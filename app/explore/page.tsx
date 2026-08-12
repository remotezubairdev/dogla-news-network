import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/navbar";

export default async function ExplorePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get recent posts
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      image_url,
      created_at,
      user_id,
      profiles!posts_user_id_fkey (
        username,
        full_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  // Get users to discover
  const { data: users } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      full_name,
      avatar_url,
      bio
    `)
    .neq("id", user.id)
    .limit(8);

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F80ED]">
            Dogla News Network
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B1F3A]">
            Explore
          </h1>

          <p className="mt-2 text-slate-500">
            Discover stories, people and conversations across Dogla.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Discover posts */}
          <section>

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0B1F3A]">
                  Latest stories
                </h2>

                <p className="text-sm text-slate-500">
                  What's happening right now
                </p>
              </div>
            </div>

            <div className="space-y-5">

              {posts?.map((post: any) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="p-6">

                    {/* Author */}
                    <Link
                      href={`/profile/${post.user_id}`}
                      className="mb-5 flex items-center gap-3"
                    >
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

                      <div>
                        <p className="font-bold text-[#0B1F3A]">
                          {post.profiles?.full_name ||
                            post.profiles?.username ||
                            "User"}
                        </p>

                        <p className="text-xs text-slate-500">
                          @{post.profiles?.username}
                        </p>
                      </div>
                    </Link>

                    {/* Content */}
                    {post.content && (
                      <p className="whitespace-pre-wrap leading-7 text-slate-700">
                        {post.content}
                      </p>
                    )}

                    {/* Image */}
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="mt-5 max-h-[550px] w-full rounded-xl object-cover"
                      />
                    )}

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>

                  </div>
                </article>
              ))}

              {(!posts || posts.length === 0) && (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <p className="font-semibold text-[#0B1F3A]">
                    No stories yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Be the first person to share something.
                  </p>
                </div>
              )}

            </div>
          </section>

          {/* Discover people */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5">

              <p className="text-xs font-bold uppercase tracking-widest text-[#2F80ED]">
                Discover
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#0B1F3A]">
                People to follow
              </h2>

              <div className="mt-5 space-y-4">

                {users?.map((person) => (
                  <Link
                    key={person.id}
                    href={`/profile/${person.id}`}
                    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
                  >

                    {person.avatar_url ? (
                      <img
                        src={person.avatar_url}
                        alt=""
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-sm font-bold text-white">
                        {(
                          person.full_name ||
                          person.username ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#0B1F3A]">
                        {person.full_name || person.username}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        @{person.username}
                      </p>
                    </div>

                  </Link>
                ))}

                {(!users || users.length === 0) && (
                  <p className="py-5 text-center text-sm text-slate-400">
                    No other users yet.
                  </p>
                )}

              </div>

            </div>
          </aside>

        </div>

      </div>
    </main>
  );
}