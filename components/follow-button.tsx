"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type FollowButtonProps = {
  profileId: string;
};

export default function FollowButton({
  profileId,
}: FollowButtonProps) {
  const supabase = createClient();

  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFollowing() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || user.id === profileId) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", user.id)
        .eq("following_id", profileId)
        .maybeSingle();

      setFollowing(!!data);
      setLoading(false);
    }

    checkFollowing();
  }, [profileId, supabase]);

  async function toggleFollow() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    if (following) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", profileId);

      if (!error) {
        setFollowing(false);
      }
    } else {
      const { error } = await supabase
        .from("follows")
        .insert({
          follower_id: user.id,
          following_id: profileId,
        });

      if (!error) {
        setFollowing(true);
      }
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <button
        disabled
        className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500"
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={toggleFollow}
      className={
        following
          ? "rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#0B1F3A] transition hover:bg-slate-50"
          : "rounded-lg bg-[#0B1F3A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123B68]"
      }
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}