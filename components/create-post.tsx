"use client";

import imageCompression from "browser-image-compression";
import { useState } from "react";

type CreatePostProps = {
  action: (formData: FormData) => Promise<void>;
};

export default function CreatePost({ action }: CreatePostProps) {
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState<"report" | "poll">("report");
  const [options, setOptions] = useState(["", ""]);

  function addOption() {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;

    setOptions(options.filter((_, i) => i !== index));
  }

  function updateOption(index: number, value: string) {
    setOptions(
      options.map((option, i) => (i === index ? value : option))
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.set("post_type", type);

    if (type === "poll") {
      const question = formData.get("content")?.toString().trim();

      if (!question) {
        return;
      }

      const validOptions = options
        .map((option) => option.trim())
        .filter(Boolean);

      if (validOptions.length < 2) {
        return;
      }

      formData.set("poll_options", JSON.stringify(validOptions));

      // Polls don't need an image.
      formData.delete("image");
    }

    const image = formData.get("image");

    if (
      type === "report" &&
      image instanceof File &&
      image.size > 0
    ) {
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

    setUploading(true);

    await action(formData);

    setUploading(false);
    form.reset();
    setType("report");
    setOptions(["", ""]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-4"
    >
      {/* POST TYPE SWITCH */}
      <div className="flex rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setType("report")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
            type === "report"
              ? "bg-white text-[#0B1F3A] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          📝 Report
        </button>

        <button
          type="button"
          onClick={() => setType("poll")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
            type === "poll"
              ? "bg-white text-[#0B1F3A] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          📊 Poll
        </button>
      </div>

      {/* CONTENT / QUESTION */}
      <textarea
        name="content"
        placeholder={
          type === "poll"
            ? "Ask the Dogla community something..."
            : "What's happening?"
        }
        className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-[#0B1F3A] outline-none placeholder:text-slate-400 focus:border-[#2F80ED] focus:ring-2 focus:ring-blue-100"
        rows={4}
        maxLength={5000}
        required
      />

      {/* POLL OPTIONS */}
      {type === "poll" && (
        <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <div>
            <p className="text-sm font-black text-[#0B1F3A]">
              Poll options
            </p>

            <p className="text-xs text-slate-500">
              Give the community something to argue about. 😭
            </p>
          </div>

          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(event) =>
                  updateOption(index, event.target.value)
                }
                placeholder={`Option ${index + 1}`}
                maxLength={120}
                required
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-blue-100"
              />

              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="rounded-lg px-3 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove option ${index + 1}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {options.length < 4 && (
            <button
              type="button"
              onClick={addOption}
              className="text-xs font-black text-[#2F80ED] hover:underline"
            >
              + Add another option
            </button>
          )}
        </div>
      )}

      {/* IMAGE */}
      {type === "report" && (
        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-600"
        />
      )}

      <button
        type="submit"
        disabled={uploading}
        className="w-full rounded-lg bg-[#0B1F3A] px-6 py-3 font-semibold text-white transition hover:bg-[#123B68] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading
          ? "Broadcasting..."
          : type === "poll"
            ? "📊 Publish Poll"
            : "📡 Broadcast"}
      </button>
    </form>
  );
}
