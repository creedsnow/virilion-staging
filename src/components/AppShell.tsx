"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AgeGate } from "./AgeGate";
import { BottomNav } from "./BottomNav";
import { DemoBadge } from "./DemoBadge";
import { useTheme } from "./ThemeProvider";
import { getAgeOk, getPlayer, getVessel } from "@/lib/storage";

const PUBLIC = new Set(["/enter", "/rules"]);

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4.2 1.5 5.8 1.5 5.8H5s1.5-1.6 1.5-5.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 18.5a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 8h10M18 8h2M4 16h2M10 16h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8" cy="16" r="2.25" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19 14.5A7.5 7.5 0 0 1 9.5 5 7.2 7.2 0 1 0 19 14.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLamp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 3h6M10 3v2h4V3M8 7h8l1 3v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V10l1-3Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path d="M12 10v5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
    </svg>
  );
}

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
    if (
      hasPlayer &&
      !hasVessel &&
      pathname !== "/rite" &&
      pathname !== "/enter" &&
      pathname !== "/rules"
    ) {
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
  const isRealm = pathname === "/";
  const subtitle =
    pathname === "/"
      ? "The World Feed"
      : pathname.startsWith("/rite")
        ? "Rite of Making"
        : pathname.startsWith("/scenes")
          ? "Live rooms"
          : pathname.startsWith("/map")
            ? "One world"
            : pathname.startsWith("/dice")
              ? "Casting Bowl"
              : pathname.startsWith("/self")
                ? "Vessel · Player"
                : pathname.startsWith("/weave")
                  ? "Bonds · Constellation"
                  : pathname.startsWith("/codex")
                    ? "The World Codex"
                    : pathname.startsWith("/rules")
                      ? "Community rules"
                      : pathname.startsWith("/admin")
                        ? "Demo GM"
                        : "Staging demo";

  return (
    <div className={`min-h-dvh flex flex-col text-fg ${isEnter ? "" : "app-canvas"}`}>
      {!isEnter ? (
        <header className="shell-header sticky top-0 z-30 border-b border-border/70 bg-bg/88 backdrop-blur-md">
          <div className="mx-auto max-w-lg flex items-center justify-between gap-3 px-4 py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <Image
                src="/virilion-logo.png"
                alt=""
                width={32}
                height={32}
                className="rounded-[0.55rem] shrink-0 shadow-[0_0_16px_rgba(123,94,167,0.35)]"
              />
              <div className="min-w-0">
                <p className="font-display text-[0.95rem] tracking-[0.2em] uppercase text-gold-soft leading-none">
                  Virilion
                </p>
                <p className="text-[9px] tracking-[0.16em] uppercase text-fg-muted mt-1 truncate">
                  {subtitle}
                </p>
              </div>
              <DemoBadge className="inline-flex shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {showNav ? (
                <a
                  href="/rules"
                  className="text-[10px] tracking-[0.12em] uppercase text-fg-muted hover:text-gold-soft px-1.5 hidden sm:inline"
                  title="Community rules"
                >
                  Rules
                </a>
              ) : null}
              {showNav && isRealm ? (
                <span className="pill-ok" title="Demo cast — not live world count">
                  <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
                  Demo cast
                </span>
              ) : null}
              {showNav ? (
                <>
                  <button
                    type="button"
                    className="header-icon-btn opacity-50 cursor-not-allowed"
                    aria-label="Filters · Coming soon"
                    title="Filters · Coming soon"
                    disabled
                  >
                    <IconSliders />
                  </button>
                  <button
                    type="button"
                    className="header-icon-btn relative opacity-50 cursor-not-allowed"
                    aria-label="Notifications · Coming soon"
                    title="Notifications · Coming soon"
                    disabled
                  >
                    <IconBell />
                  </button>
                </>
              ) : null}
              <button
                type="button"
                className="header-icon-btn"
                onClick={toggle}
                aria-label={theme === "dark" ? "Switch to parchment light" : "Switch to moonlight dark"}
                title={theme === "dark" ? "Parchment" : "Moonlight"}
              >
                {theme === "dark" ? <IconLamp /> : <IconMoon />}
              </button>
            </div>
          </div>
        </header>
      ) : null}
      <main
        className={`flex-1 w-full max-w-lg mx-auto px-4 py-4 ${
          showNav ? "pb-28" : isEnter ? "pb-0 pt-0 px-0 max-w-none" : "pb-8"
        }`}
      >
        {children}
      </main>
      {showNav ? <BottomNav /> : null}
    </div>
  );
}
