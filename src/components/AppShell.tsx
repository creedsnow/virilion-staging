"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AgeGate } from "./AgeGate";
import { BottomNav } from "./BottomNav";
import { DemoBadge } from "./DemoBadge";
import { useTheme } from "./ThemeProvider";
import { getAgeOk, getPlayer, getVessel } from "@/lib/storage";

const PUBLIC = new Set(["/enter"]);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle, ready: themeReady } = useTheme();
  const [ready, setReady] = useState(false);
  const [ageOk, setAgeOkState] = useState(false);
  const [hasPlayer, setHasPlayer] = useState(false);
  const [hasVessel, setHasVessel] = useState(false);

  useEffect(() => {
    setAgeOkState(getAgeOk());
    setHasPlayer(!!getPlayer());
    setHasVessel(!!getVessel());
    setReady(true);
  }, [pathname]);

  useEffect(() => {
    if (!ready) return;
    if (!ageOk) return;
    const isPublic = PUBLIC.has(pathname) || pathname.startsWith("/rite");
    if (!hasPlayer && !isPublic && pathname !== "/enter") {
      router.replace("/enter");
      return;
    }
    if (hasPlayer && !hasVessel && pathname !== "/rite" && pathname !== "/enter") {
      router.replace("/rite");
    }
  }, [ready, ageOk, hasPlayer, hasVessel, pathname, router]);

  if (!ready || !themeReady) {
    return (
      <div className="min-h-dvh night-sky flex items-center justify-center text-fg-muted text-sm">
        <span className="relative z-[1] display-italic text-gold-soft text-lg">
          Opening the portal…
        </span>
      </div>
    );
  }

  if (!ageOk) {
    return <AgeGate onConfirm={() => setAgeOkState(true)} />;
  }

  const showNav =
    hasPlayer && pathname !== "/enter" && !pathname.startsWith("/rite");
  const isEnter = pathname === "/enter";

  return (
    <div className="min-h-dvh flex flex-col bg-bg text-fg">
      {!isEnter ? (
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/80 bg-bg/90 px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <Image
              src="/virilion-logo.png"
              alt=""
              width={28}
              height={28}
              className="rounded-md shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display text-sm tracking-[0.16em] uppercase text-gold-soft leading-none">
                Virilion
              </p>
              <p className="text-[9px] tracking-[0.14em] uppercase text-fg-muted mt-0.5 truncate">
                {pathname === "/" ? "The world feed" : "Staging demo"}
              </p>
            </div>
            <DemoBadge />
          </div>
          <div className="flex items-center gap-2">
            {showNav ? (
              <span className="pill-ok hidden sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                walking
              </span>
            ) : null}
            <button
              type="button"
              className="btn-ghost text-xs py-1.5 px-3 min-h-0"
              onClick={toggle}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </header>
      ) : null}
      <main
        className={`flex-1 w-full max-w-lg mx-auto px-4 py-4 ${
          showNav ? "pb-28" : isEnter ? "pb-0 pt-0" : "pb-8"
        }`}
      >
        {children}
      </main>
      {showNav ? <BottomNav /> : null}
    </div>
  );
}
