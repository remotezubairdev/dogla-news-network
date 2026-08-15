import { createClient } from "@/lib/supabase/server";

export async function getNotifications(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select(`
      id,
      type,
      read,
      created_at,
      actor_id,
      post_id,
      poll_id
    `)
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("NOTIFICATIONS ERROR:", error);
    return [];
  }

  if (!data?.length) return [];

  const actorIds = [
    ...new Set(
      data
        .map((notification) => notification.actor_id)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  if (!actorIds.length) {
    return data.map((notification) => ({
      ...notification,
      actor: null,
    }));
  }

  const { data: actors, error: actorsError } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .in("id", actorIds);

  if (actorsError) {
    console.error("NOTIFICATION ACTORS ERROR:", actorsError);
  }

  const actorMap = new Map(
    (actors ?? []).map((actor) => [actor.id, actor])
  );

  return data.map((notification) => ({
    ...notification,
    actor: notification.actor_id
      ? actorMap.get(notification.actor_id) ?? null
      : null,
  }));
}
