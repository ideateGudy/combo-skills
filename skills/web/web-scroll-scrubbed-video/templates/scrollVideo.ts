import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollVideoOptions {
  trigger: HTMLElement;          // the section that gets pinned
  video: HTMLVideoElement;
  desktopSrc: string;
  mobileSrc: string;
  mobileQuery?: string;          // default "(max-width: 768px)"
  scrollLength?: string;         // default "+=300%"
  smooth?: number;               // 0..1 lerp factor per frame, default 0.15 (1 = no smoothing)
  onProgress?: (progress: number) => void;
}

/** Binds video.currentTime to scroll progress. Returns a cleanup function. */
export function createScrollVideo(opts: ScrollVideoOptions): () => void {
  const {
    trigger, video, desktopSrc, mobileSrc,
    mobileQuery = "(max-width: 768px)",
    scrollLength = "+=300%",
    smooth = 0.15,
    onProgress,
  } = opts;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mq = window.matchMedia(mobileQuery);
  let teardown: (() => void) | null = null;

  const init = () => {
    teardown?.();
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.removeAttribute("autoplay");
    video.removeAttribute("loop");
    video.controls = false;

    if (reduce.matches) { teardown = null; return; } // static poster fallback, no pin, no scrub

    let st: ScrollTrigger | null = null;
    let target = 0, current = 0, lastSet = -1, duration = 0;
    let disposed = false;

    const tick = () => {
      if (!duration) return;
      current += (target - current) * smooth;
      if (Math.abs(target - current) < 0.0005) current = target;
      const t = Math.min(current * duration, duration - 0.001);
      if (!video.seeking && Math.abs(t - lastSet) >= 1 / 120) {
        video.currentTime = t;
        lastSet = t;
      }
    };

    const onMeta = () => {
      if (disposed) return;
      duration = video.duration;
      // iOS priming: decode first frame, then stay paused
      video.play().then(() => video.pause()).catch(() => {});
      st = ScrollTrigger.create({
        trigger,
        start: "top top",
        end: scrollLength,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => { target = self.progress; onProgress?.(self.progress); },
      });
      gsap.ticker.add(tick);
      ScrollTrigger.refresh();
    };

    const src = mq.matches ? mobileSrc : desktopSrc;
    video.addEventListener("loadedmetadata", onMeta, { once: true });
    video.src = src;
    video.load();

    teardown = () => {
      disposed = true;
      video.removeEventListener("loadedmetadata", onMeta);
      gsap.ticker.remove(tick);
      st?.kill();
      st = null;
    };
  };

  init();
  mq.addEventListener("change", init);
  reduce.addEventListener("change", init);

  return () => {
    mq.removeEventListener("change", init);
    reduce.removeEventListener("change", init);
    teardown?.();
  };
}
