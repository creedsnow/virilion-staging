"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AgeGate } from "./AgeGate";
import { DemoBadge } from "./DemoBadge";
import { SiteNav } from "./SiteNav";
import { UiAssetIcon } from "./UiAssetIcon";
import { useTheme } from "./ThemeProvider";
import { clearSession, getAgeOk, getPlayer, getVessel, subscribeVessel } from "@/lib/storage";
import { logoutSession } from "@/lib/auth-client";

/** Guest-browsable public site routes (signed-out OK). */
const PUBLIC_PREFIXES = [
  "/",
  "/login",
  "/join",
  "/codex",
  "/map",
  "/chronicle",
  "/about",
  "/rules",
  "/terms",
  "/privacy",
];

function isPublicPath(pathname: string) {
  if (PUBLIC_PREFIXES.includes(pathname)) return true;
  if (pathname.startsWith("/codex/")) return true;
  if (pathname.startsWith("/join")) return true;
  return false;
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

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function subtitleFor(pathname: string) {
  if (pathname === "/") return "Welcome";
  if (pathname === "/dash") return "Home";
  if (pathname.startsWith("/join")) return "Rite of Making";
  if (pathname.startsWith("/login")) return "Sign in";
  if (pathname.startsWith("/scenes")) return "Halls & rooms";
  if (pathname.startsWith("/map")) return "One world";
  if (pathname.startsWith("/dice")) return "Casting Bowl";
  if (pathname.startsWith("/profile")) return "Character · Player";
  if (pathname.startsWith("/bonds")) return "Bonds";
  if (pathname.startsWith("/codex")) return "The World Codex";
  if (pathname.startsWith("/whispers")) return "Whispers";
  if (pathname.startsWith("/settings")) return "Settings & safety";
  if (pathname.startsWith("/events")) return "Calendar";
  if (pathname.startsWith("/guilds")) return "Guilds";
  if (pathname.startsWith("/campaigns")) return "Campaigns";
  if (pathname.startsWith("/chronicle")) return "Chronicle";
  if (pathname.startsWith("/about")) return "About";
  if (pathname.startsWith("/rules")) return "Community rules";
  if (pathname.startsWith("/terms")) return "Terms";
  if (pathname.startsWith("/privacy")) return "Privacy";
  if (pathname.startsWith("/notifs")) return "Notifications";
  if (pathname.startsWith("/admin")) return "Demo GM";
  return "Virilion";
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle, ready: themeReady } = useTheme();
  const [ready, setReady] = useState(false);
  const [ageOk, setAgeOkState] = useState(false);
  const [hasPlayer, setHasPlayer] = useState(false);
  const [hasVessel, setHasVessel] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setAgeOkState(getAgeOk());
    setHasPlayer(!!getPlayer());
    setHasVessel(!!getVessel());
    setReady(true);
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    return subscribeVessel(() => {
      setHasPlayer(!!getPlayer());
      setHasVessel(!!getVessel());
      setAgeOkState(getAgeOk());
    });
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  function logout() {
    void (async () => {
      await logoutSession();
      clearSession();
      setHasPlayer(false);
      setHasVessel(false);
      setDrawerOpen(false);
      router.replace("/login");
    })();
  }

  useEffect(() => {
    if (!ready) return;
    if (!ageOk) return;

    // Signed-in members never stay on the guest marketing landing.
    if (hasPlayer && hasVessel && pathname === "/") {
      router.replace("/dash");
      return;
    }

    const publicOk = isPublicPath(pathname);

    if (!hasPlayer && !publicOk) {
      router.replace("/login");
      return;
    }

    if (
      hasPlayer &&
      !hasVessel &&
      pathname !== "/join" &&
      pathname !== "/login" &&
      pathname !== "/rules" &&
      pathname !== "/terms" &&
      pathname !== "/privacy"
    ) {
      router.replace("/join");
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

  const isLogin = pathname === "/login";
  const isGuestLanding = pathname === "/" && !hasPlayer;
  const isJoin = pathname.startsWith("/join");
  const showMemberChrome =
    hasPlayer && hasVessel && !isLogin && !isJoin;
  const wideMain =
    isGuestLanding ||
    pathname.startsWith("/map") ||
    pathname.startsWith("/codex") ||
    pathname === "/dash" ||
    pathname.startsWith("/chronicle") ||
    pathname.startsWith("/about");

  return (
    <div
      className={`min-h-dvh flex flex-col text-fg ${
        isLogin || isGuestLanding ? "" : "app-canvas"
      }`}
    >
      {!isLogin ? (
        <header className="shell-header sticky top-0 z-30 border-b border-border/70 bg-bg/88 backdrop-blur-md">
          <div className="site-header-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              {showMemberChrome ? (
                <button
                  type="button"
                  className="header-icon-btn site-nav-burger lg:hidden"
                  aria-label="Open menu"
                  aria-expanded={drawerOpen}
                  onClick={() => setDrawerOpen(true)}
                >
                  <IconMenu />
                </button>
              ) : null}
              <Link href={showMemberChrome ? "/dash" : "/"} className="flex items-center gap-2.5 min-w-0">
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
                    {subtitleFor(pathname)}
                  </p>
                </div>
              </Link>
              <DemoBadge className="inline-flex shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {!hasPlayer ? (
                <>
                  <Link
                    href="/codex"
                    className="text-[10px] tracking-[0.12em] uppercase text-fg-muted hover:text-gold-soft px-1.5 hidden sm:inline"
                  >
                    Codex
                  </Link>
                  <Link
                    href="/join"
                    className="text-[10px] tracking-[0.12em] uppercase text-gold-soft hover:text-gold px-1.5 hidden sm:inline"
                  >
                    Join
                  </Link>
                  <Link href="/login" className="btn-ghost text-xs py-1.5 px-2.5 !min-h-0">
                    Sign in
                  </Link>
                </>
              ) : (
                <Link
                  href="/rules"
                  className="text-[10px] tracking-[0.12em] uppercase text-fg-muted hover:text-gold-soft px-1.5 hidden sm:inline"
                  title="Community rules"
                >
                  Rules
                </Link>
              )}
              <button
                type="button"
                className="header-icon-btn"
                onClick={toggle}
                aria-label={
                  theme === "dark" ? "Switch to parchment light" : "Switch to moonlight dark"
                }
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

      <div className={`site-body ${showMemberChrome ? "site-body-member" : ""}`}>
        {showMemberChrome ? (
          <aside className="site-aside hidden lg:block" aria-label="Site navigation">
            <SiteNav mode="side" onLogout={logout} />
          </aside>
        ) : null}

        <main
          className={`site-main flex-1 w-full px-4 py-4 ${
            wideMain ? "site-main-wide" : "site-main-narrow"
          } ${isLogin ? "pb-0 pt-0 px-0 max-w-none" : "pb-10"}`}
        >
          {children}
        </main>
      </div>

      {showMemberChrome ? (
        <SiteNav
          mode="drawer"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onLogout={logout}
        />
      ) : null}

      {!isLogin && !showMemberChrome ? (
        <footer className="site-footer">
          <div className="site-footer-inner">
            <Link href="/about">About</Link>
            <Link href="/rules">Rules</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/codex">Codex</Link>
            <Link href="/map">Map</Link>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
