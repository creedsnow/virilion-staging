"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type WispLoop,
  wispApng,
  wispStill,
  wispWebm,
} from "@/lib/assets";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const LOOPING: ReadonlySet<WispLoop> = new Set(["idle", "greet", "notify"]);

type Props = {
  /** External loop override (e.g. from care buttons). */
  loop?: WispLoop;
  onLoopSettled?: (loop: WispLoop) => void;
  size?: number;
  className?: string;
};

/**
 * Companion wisp for /wisp pet panel only (never Map/Scenes/showcase).
 * Deferred post-launch — /wisp soft-redirects; keep this component for re-enable.
 * WebM primary → APNG fallback → still when prefers-reduced-motion.
 */
export function WispPet({
  loop = "idle",
  onLoopSettled,
  size = 96,
  className = "",
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<WispLoop>(loop);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setActive(loop);
  }, [loop]);

  const handleEnded = useCallback(() => {
    if (LOOPING.has(active)) return;
    setActive("idle");
    onLoopSettled?.("idle");
  }, [active, onLoopSettled]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    v.load();
    const play = v.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        /* autoplay may be blocked; poster/still still shows */
      });
    }
  }, [active, reduced]);

  if (reduced) {
    return (
      <img
        src={wispStill(256)}
        alt=""
        width={size}
        height={size}
        className={`wisp-pet-media ${className}`.trim()}
        draggable={false}
      />
    );
  }

  const looping = LOOPING.has(active);

  return (
    <video
      ref={videoRef}
      key={active}
      className={`wisp-pet-media ${className}`.trim()}
      width={size}
      height={size}
      autoPlay
      muted
      playsInline
      loop={looping}
      poster={wispStill(256)}
      onEnded={handleEnded}
      aria-hidden
    >
      <source src={wispWebm(active)} type="video/webm" />
      {/* APNG as last-resort for engines that ignore WebM alpha */}
      <img
        src={wispApng(active)}
        alt=""
        width={size}
        height={size}
        className="wisp-pet-media"
        draggable={false}
      />
    </video>
  );
}
