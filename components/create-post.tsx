"use client";

import imageCompression from "browser-image-compression";
import { useState } from "react";

type CreatePostProps = {
  action: (formData: FormData) => Promise<void>;
};

export default function CreatePost({ action }: CreatePostProps) {
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const image = formData.get("image");

    if (image instanceof File && image.size > 0) {
      try {
        setUploading(true);

        const compressedImage = await imageCompression(image, {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp",
          initialQuality: 0.8,
        });

        formData.set("image", compressedImage);
      } catch (error) {
        console.error("IMAGE COMPRESSION ERROR:", error);
        setUploading(false);
        return;
      }
    }

    await action(formData);

    setUploading(false);
    form.reset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <textarea
        name="content"
        placeholder="What's happening?"
        className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-[#0B1F3A] outline-none placeholder:text-slate-400 focus:border-[#2F80ED] focus:ring-2 focus:ring-blue-100"
        rows={4}
        maxLength={5000}
        required
      />

      <input
        type="file"
        name="image"
        accept="image/jpeg,image/png,image/webp"
        className="mt-3 block w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-600"
      />

      <button
        type="submit"
        disabled={uploading}
        className="mt-3 rounded-lg bg-[#0B1F3A] px-6 py-2.5 font-semibold text-white transition hover:bg-[#123B68] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Compressing & Broadcasting..." : "Broadcast"}
      </button>
    </form>
  );
}