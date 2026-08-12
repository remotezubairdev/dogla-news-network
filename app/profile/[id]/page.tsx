import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/navbar";
import FollowButton from "@/components/follow-button";

type ProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserProfilePage({
  params,
}: ProfilePageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      full_name,
      avatar_url,
      bio
    `)
    .eq("id", id)
    .single();

  if (!profile) {
    notFound();
  }

  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", id);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", id);

  const { count: postsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-10">

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="h-32 bg-[#0B1F3A] sm:h-40">
            <div className="flex h-full items-end px-6 pb-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                Dogla News Network
              </p>
            </div>
          </div>

          <div className="px-6 pb-7">

            <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">

              <div>
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile"}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#0B1F3A] text-3xl font-black text-white shadow-md sm:h-28 sm:w-28">
                    {(
                      profile.full_name ||
                      profile.username ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>

              {user.id !== profile.id && (
                <FollowButton profileId={profile.id} />
              )}

            </div>

            <div className="mt-5">

              <h1 className="text-2xl font-black text-[#0B1F3A]">
                {profile.full_name || "User"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                @{profile.username}
              </p>

            </div>

            {profile.bio && (
              <p className="mt-5 max-w-2xl leading-7 text-slate-700">
                {profile.bio}
              </p>
            )}

            <div className="mt-7 flex gap-8 border-t border-slate-200 pt-6">

              <div>
                <p className="text-lg font-bold text-[#0B1F3A]">
                  {postsCount ?? 0}
                </p>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Posts
                </p>
              </div>

              <div>
                <p className="text-lg font-bold text-[#0B1F3A]">
                  {followersCount ?? 0}
                </p>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Followers
                </p>
              </div>

              <div>
                <p className="text-lg font-bold text-[#0B1F3A]">
                  {followingCount ?? 0}
                </p>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Following
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </main>
  );
}