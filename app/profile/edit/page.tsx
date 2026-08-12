"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditProfilePage() {
  const supabase = createClient();
  const router = useRouter();


  const [avatarUrl, setAvatarUrl] = useState("");
const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, bio, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setUsername(data.username || "");
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router, supabase]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    let newAvatarUrl = avatarUrl;

    if (avatarFile) {
    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, {
        upsert: false,
        });

    if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
    }

    const {
        data: { publicUrl },
    } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    newAvatarUrl = publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        username: username.trim(),
        full_name: fullName.trim(),
        bio: bio.trim(),
        avatar_url: newAvatarUrl,
        })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-xl">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h1 className="text-2xl font-bold">
            Edit profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update your information.
          </p>

          <form onSubmit={saveProfile} className="mt-8 space-y-5">

            <div>
            <label className="mb-2 block text-sm font-medium">
                Profile picture
            </label>

            <div className="flex items-center gap-4">

                {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt="Profile"
                    width={20}
                    height={20}
                    className="h-20 w-20 rounded-full object-cover"
                />
                ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                    No photo
                </div>
                )}

                <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) =>
                    setAvatarFile(e.target.files?.[0] || null)
                }
                />

            </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Username
              </label>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full name
              </label>

              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={160}
                placeholder="Tell your friends about yourself..."
                className="w-full resize-none rounded-lg border px-3 py-2 outline-none focus:ring-2"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex gap-3">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="rounded-lg border px-5 py-2"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>
    </main>
  );
}