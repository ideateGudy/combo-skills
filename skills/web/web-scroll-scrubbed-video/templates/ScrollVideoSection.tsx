"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { createScrollVideo } from "@/lib/scrollVideo";

interface Props {
  desktopSrc: string;
  mobileSrc: string;
  poster?: string;
  scrollLength?: string;
  className?: string;
  children?: ReactNode; // overlay content (headline, CTA)
}

export function ScrollVideoSection({ desktopSrc, mobileSrc, poster, scrollLength, className = "", children }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current) return;
    return createScrollVideo({
      trigger: sectionRef.current,
      video: videoRef.current,
      desktopSrc,
      mobileSrc,
      scrollLength,
    });
  }, [desktopSrc, mobileSrc, scrollLength]);

  return (
    <section ref={sectionRef} className={`relative h-[100svh] w-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      {/* contrast scrim for overlay text; tune with tokens */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      <div className="relative z-10 flex h-full items-center justify-center">{children}</div>
    </section>
  );
}
