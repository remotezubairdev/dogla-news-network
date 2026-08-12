import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import LikeButton from "@/components/like-button";
import Comments from "@/components/comments";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Trending from "@/components/trending";

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
    const extension = image.name.split(".").pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
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
    console.error(error);
    return;
  }

  revalidatePath("/protected");
}

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
  .order("created_at", { ascending: false });

  if (error) {
    console.error("POSTS ERROR:", error);
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

<div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">

  <Sidebar />

  <section className="min-w-0 flex-1">

    <div className="mb-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F80ED]">
        Dogla News Network
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B1F3A]">
        Community Feed
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Stories, updates and conversations from your community.
      </p>
    </div>

    {/* YOUR EXISTING CREATE POST CARD GOES HERE */}
<div className="mx-auto max-w-3xl px-4 py-8">

        {/* Create post */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2F80ED]">
              Dogla News
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#0B1F3A]">
              Share breaking news
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Jhoot, imaandari ke sath
            </p>
          </div>

          <form
            action={createPost}
            encType="multipart/form-data"
          >
            <textarea
              name="content"
              placeholder="Write something..."
              className="w-full resize-none rounded-lg border p-3 outline-none focus:ring-2"
              rows={4}
              maxLength={5000}
              required
            />

            <input
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/webp"
              className="mt-3 block w-full text-sm"
            />

            <button
              type="submit"
              className="mt-3 rounded-lg bg-[#0B1F3A] px-6 py-2.5 font-semibold text-white transition hover:bg-[#123B68]"
              >
              Post
            </button>
          </form>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {error && (
            <p className="text-red-500">
              Could not load posts.
            </p>
          )}

          {posts?.map((post) => (
            <article
              id={`post-${post.id}`}
              key={post.id}
              className="p-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="mb-5 flex items-center gap-3">

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
      ).charAt(0).toUpperCase()}
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

</div>

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
                initialLikes={post.likes?.map((like) => like.user_id) ?? []}
              />

              <Comments
                postId={post.id}
                userId={user.id}
                initialComments={post.comments ?? []}
              />

              <p className="mt-4 text-xs text-gray-400">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </article>
          ))}

          {posts?.length === 0 && (
            <div className="rounded-xl border bg-white p-8 text-center">
              <p className="text-gray-500">
                No posts yet. Be the first to post! 👋
              </p>
            </div>
          )}
        </div>

      </div>
    {/* YOUR EXISTING POSTS LOOP GOES HERE */}

  </section>

  <Trending />

</div>
      
    </main>
  );
}