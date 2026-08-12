"use client";

import { useEffect, useRef, useState } from "react";

export default function LiveVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay may be blocked by the browser.
          });
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;

    if (!video) return;

    if (soundOn) {
      video.muted = true;
      setSoundOn(false);
    } else {
      video.muted = false;
      video.volume = 0.2;
      setSoundOn(true);
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="aspect-video w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/videos/who-we-are.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute left-4 top-4 flex items-center gap-2 rounded bg-black/70 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        LIVE
      </div>

      <button
        type="button"
        onClick={toggleSound}
        className="absolute bottom-4 right-4 rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-black/90"
        aria-label={soundOn ? "Mute video" : "Turn on sound"}
      >
        {soundOn ? "🔊 Sound On" : "🔇 Sound Off"}
      </button>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-12">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
          SPECIAL REPORT
        </p>

        <p className="mt-1 text-lg font-black text-white sm:text-xl">
          WHO ARE THE PEOPLE BEHIND DOGLA NEWS?
        </p>
      </div>
    </div>
  );
}
