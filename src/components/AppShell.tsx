"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AgeGate } from "./AgeGate";
import { BottomNav } from "./BottomNav";
import { DemoBadge } from "./DemoBadge";
import { UiAssetIcon } from "./UiAssetIcon";
import { useTheme } from "./ThemeProvider";
import { clearSession, getAgeOk, getPlayer, getVessel, subscribeVessel } from "@/lib/storage";
import { logoutSession } from "@/lib/auth-client";

const PUBLIC = new Set(["/enter", "/rules"]);

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

function IconMore() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAgeOkState(getAgeOk());
    setHasPlayer(!!getPlayer());
    setHasVessel(!!getVessel());
    setReady(true);
    setMenuOpen(false);
  }, [pathname]);

  // Keep shell auth flags in sync after Log out / GM approve / wipe without
  // requiring a pathname change (Enter logout stays on /enter).
  useEffect(() => {
    return subscribeVessel(() => {
      setHasPlayer(!!getPlayer());
      setHasVessel(!!getVessel());
      setAgeOkState(getAgeOk());
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function logout() {
    void (async () => {
      await logoutSession();
      clearSession();
      setHasPlayer(false);
      setHasVessel(false);
      setMenuOpen(false);
      router.replace("/enter");
    })();
  }

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
  const subtitle =
    pathname === "/"
      ? "The Realm"
      : pathname.startsWith("/rite")
        ? "Rite of Making"
        : pathname.startsWith("/scenes")
          ? "Halls & rooms"
          : pathname.startsWith("/map")
            ? "One world"
            : pathname.startsWith("/dice")
              ? "Casting Bowl"
              : pathname.startsWith("/self")
                ? "Character · Player"
                : pathname.startsWith("/weave")
                  ? "Bonds · Constellation"
                  : pathname.startsWith("/codex")
                    ? "The World Codex"
                    : pathname.startsWith("/inbox")
                      ? "Whispers"
                      : pathname.startsWith("/safety")
                        ? "Safety"
                        : pathname.startsWith("/calendar")
                          ? "Coming up"
                          : pathname.startsWith("/guilds")
                            ? "Guilds"
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
              {hasPlayer ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    className="header-icon-btn"
                    aria-label="Menu"
                    aria-expanded={menuOpen}
                    aria-haspopup="menu"
                    title="Menu"
                    onClick={() => setMenuOpen((o) => !o)}
                  >
                    <UiAssetIcon name="more" size={16} fallback={<IconMore />} />
                  </button>
                  {menuOpen ? (
                    <div
                      role="menu"
                      className="shell-overflow-menu card stone-panel absolute right-0 top-[calc(100%+0.35rem)] z-40 min-w-[9.5rem] p-1.5 shadow-lg"
                    >
                      <Link
                        href="/self"
                        role="menuitem"
                        className="shell-menu-item"
                        onClick={() => setMenuOpen(false)}
                      >
                        Self
                      </Link>
                      <Link
                        href="/rules"
                        role="menuitem"
                        className="shell-menu-item sm:hidden"
                        onClick={() => setMenuOpen(false)}
                      >
                        Rules
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        className="shell-menu-item w-full text-left"
                        onClick={logout}
                      >
                        Log out
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <button
                type="button"
                className="header-icon-btn"
                onClick={toggle}
                aria-label={theme === "dark" ? "Switch to parchment light" : "Switch to moonlight dark"}
                title={theme === "dark" ? "Parchment" : "Moonlight"}
              >
                {theme === "dark" ? (
                  <UiAssetIcon name="theme-light" size={16} fallback={<IconLamp />} />
                ) : (
                  <UiAssetIcon name="theme-dark" size={16} fallback={<IconMoon />} />
                )}
              </button>
            </div>
          </div>
        </header>
      ) : null}
      <main
        className={`flex-1 w-full max-w-lg mx-auto px-4 py-4 ${
          showNav ? "pb-[7.25rem]" : isEnter ? "pb-0 pt-0 px-0 max-w-none" : "pb-8"
        }`}
      >
        {children}
      </main>
      {showNav ? <BottomNav /> : null}
    </div>
  );
}
