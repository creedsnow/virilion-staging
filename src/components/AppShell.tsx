"use client";

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
        Opening the portal…
      </div>
    );
  }

  if (!ageOk) {
    return <AgeGate onConfirm={() => setAgeOkState(true)} />;
  }

  const showNav =
    hasPlayer &&
    pathname !== "/enter" &&
    !pathname.startsWith("/rite");

  return (
    <div className="min-h-dvh flex flex-col bg-bg text-fg">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold tracking-wide text-gold-soft truncate">
            Virilion
          </span>
          <DemoBadge />
        </div>
        <button
          type="button"
          className="btn-ghost text-xs py-1.5 px-3"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </header>
      <main className={`flex-1 w-full max-w-lg mx-auto px-4 py-4 ${showNav ? "pb-28" : "pb-8"}`}>
        {children}
      </main>
      {showNav ? <BottomNav /> : null}
    </div>
  );
}
