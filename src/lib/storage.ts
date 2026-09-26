import type { DemoPlayer, PresenceMode, Vessel } from "./types";

const KEYS = {
  ageOk: "virilion_age_ok",
  /** Canonical theme key. Legacy `virilion_theme` ignored (polish sessions left accidental Parchment). */
  theme: "virilion_theme_v1",
  themeLegacy: "virilion_theme",
  player: "virilion_demo_player",
  vessel: "virilion_vessel",
  pending: "virilion_pending_vessels",
  /** Canonical presence key (v1). Legacy `virilion_presence` is migrated on read. */
  presence: "virilion_presence_v1",
  presenceLegacy: "virilion_presence",
  /** Dev/QA gate: show demo wipe CTAs. Latch via ?qa=1. */
  qa: "virilion_qa",
} as const;

export type ThemeMode = "dark" | "light";
export type { PresenceMode };

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function getAgeOk(): boolean {
  if (!canUseStorage()) return false;
  return localStorage.getItem(KEYS.ageOk) === "1";
}

export function setAgeOk(): void {
  if (!canUseStorage()) return;
  localStorage.setItem(KEYS.ageOk, "1");
}

/**
 * Moonlight (dark) is the product default. Parchment (light) only when the player
 * explicitly saved it. Never consult prefers-color-scheme / matchMedia.
 */
export function getTheme(): ThemeMode {
  if (!canUseStorage()) return "dark";
  try {
    const primary = localStorage.getItem(KEYS.theme);
    if (primary === "light" || primary === "dark") return primary;
    // Drop legacy key so accidental Parchment from polish / OS traps cannot win.
    localStorage.removeItem(KEYS.themeLegacy);
  } catch {
    /* ignore */
  }
  return "dark";
}

function applyThemeDom(theme: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  // theme-color follows app theme, not OS prefers-color-scheme.
  const color = theme === "light" ? "#f7f1e4" : "#0b0a10";
  let meta = document.querySelector('meta[name="theme-color"][data-virilion-theme]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("data-virilion-theme", "1");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", color);
}

export function setTheme(theme: ThemeMode): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(KEYS.theme, theme);
    localStorage.removeItem(KEYS.themeLegacy);
  } catch {
    /* ignore */
  }
  applyThemeDom(theme);
}

/** Apply DOM theme without requiring a write (boot / hydrate). */
export function applyStoredTheme(): ThemeMode {
  const theme = getTheme();
  applyThemeDom(theme);
  return theme;
}

export function getPlayer(): DemoPlayer | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(KEYS.player);
    return raw ? (JSON.parse(raw) as DemoPlayer) : null;
  } catch {
    return null;
  }
}

export function setPlayer(player: DemoPlayer | null): void {
  if (!canUseStorage()) return;
  if (!player) {
    localStorage.removeItem(KEYS.player);
    return;
  }
  localStorage.setItem(KEYS.player, JSON.stringify(player));
}

export function getVessel(): Vessel | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(KEYS.vessel);
    return raw ? (JSON.parse(raw) as Vessel) : null;
  } catch {
    return null;
  }
}

export function setVessel(vessel: Vessel | null): void {
  if (!canUseStorage()) return;
  if (!vessel) {
    localStorage.removeItem(KEYS.vessel);
    return;
  }
  localStorage.setItem(KEYS.vessel, JSON.stringify(vessel));
}

export function getPendingVessels(): Vessel[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(KEYS.pending);
    return raw ? (JSON.parse(raw) as Vessel[]) : [];
  } catch {
    return [];
  }
}

export function addPendingVessel(vessel: Vessel): void {
  if (!canUseStorage()) return;
  const list = getPendingVessels().filter((v) => v.id !== vessel.id);
  list.push(vessel);
  localStorage.setItem(KEYS.pending, JSON.stringify(list));
}

export function approvePendingVessel(id: string): Vessel | null {
  if (!canUseStorage()) return null;
  const list = getPendingVessels();
  const found = list.find((v) => v.id === id);
  if (!found) return null;
  const approved: Vessel = { ...found, status: "approved" };
  localStorage.setItem(
    KEYS.pending,
    JSON.stringify(list.filter((v) => v.id !== id))
  );
  const current = getVessel();
  if (current && current.id === id) {
    setVessel(approved);
  }
  return approved;
}

/** Demo reject = clear from queue. If it is the active vessel, wipe so they can re-Rite. */
export function rejectPendingVessel(id: string): void {
  if (!canUseStorage()) return;
  const list = getPendingVessels().filter((v) => v.id !== id);
  localStorage.setItem(KEYS.pending, JSON.stringify(list));
  const current = getVessel();
  if (current && current.id === id) {
    localStorage.removeItem(KEYS.vessel);
  }
}

export function clearSession(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(KEYS.player);
  // Keep vessel + age + theme so "log out" returns to Enter but vessel persists for one-vessel demo.
  // Per brief: Log out from Self → Player returns to Enter. Vessel stays (one vessel lock).
}


/**
 * Dev/QA gate for demo wipe / retake CTAs.
 * Enable: visit any page with `?qa=1` (latches localStorage `virilion_qa=1`).
 * Disable: localStorage.removeItem("virilion_qa") or ?qa=0.
 * Hidden from the normal player path when unset.
 */
export function isQaMode(): boolean {
  if (!canUseStorage()) return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("qa");
    if (q === "1") {
      localStorage.setItem(KEYS.qa, "1");
      return true;
    }
    if (q === "0") {
      localStorage.removeItem(KEYS.qa);
      return false;
    }
    return localStorage.getItem(KEYS.qa) === "1";
  } catch {
    return false;
  }
}

export function wipeVesselForDemo(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(KEYS.vessel);
}

function normalizePresence(raw: string | null | undefined): PresenceMode | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (v === "scene" || v === "in scene" || v === "in_scene" || v === "inscene") {
    return "scene";
  }
  if (v === "unseen" || v === "away" || v === "hidden") return "unseen";
  if (v === "open" || v === "available") return "open";
  return null;
}

/** Cached snapshot so useSyncExternalStore getSnapshot stays referentially stable. */
let presenceSnapshot: PresenceMode | null = null;

function readPresenceRaw(): PresenceMode {
  if (!canUseStorage()) return "open";

  const primary = normalizePresence(localStorage.getItem(KEYS.presence));
  if (primary) return primary;

  const legacy = normalizePresence(localStorage.getItem(KEYS.presenceLegacy));
  if (legacy) {
    // Migrate legacy key forward so refresh keeps the choice.
    try {
      localStorage.setItem(KEYS.presence, legacy);
      localStorage.removeItem(KEYS.presenceLegacy);
    } catch {
      /* ignore */
    }
    return legacy;
  }

  try {
    const vessel = getVessel();
    const mirrored = normalizePresence(vessel?.presence ?? null);
    if (mirrored) {
      try {
        localStorage.setItem(KEYS.presence, mirrored);
        localStorage.removeItem(KEYS.presenceLegacy);
      } catch {
        /* ignore */
      }
      return mirrored;
    }
  } catch {
    /* ignore */
  }

  return "open";
}

/** One source of truth for Self + Realm: Open / In scene / Unseen. Survives refresh. */
export function getPresence(): PresenceMode {
  const next = readPresenceRaw();
  presenceSnapshot = next;
  return next;
}

export function setPresence(mode: PresenceMode): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(KEYS.presence, mode);
    // Drop legacy key so nothing re-reads a stale Open.
    localStorage.removeItem(KEYS.presenceLegacy);
  } catch {
    /* ignore */
  }
  presenceSnapshot = mode;
  // Mirror onto vessel JSON so presence survives key churn / accidental key drops.
  try {
    const vessel = getVessel();
    if (vessel && vessel.presence !== mode) {
      setVessel({ ...vessel, presence: mode });
    }
  } catch {
    /* ignore */
  }
}

function notifyPresenceListeners(): void {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event("virilion-presence"));
}

/** Subscribe to presence changes (same-tab, cross-tab, bfcache restore). */
export function subscribePresence(onStoreChange: () => void): () => void {
  if (!canUseStorage()) return () => undefined;
  const onCustom = () => {
    presenceSnapshot = null; // force re-read
    onStoreChange();
  };
  const onStorage = (e: StorageEvent) => {
    if (
      e.key === KEYS.presence ||
      e.key === KEYS.presenceLegacy ||
      e.key === KEYS.vessel
    ) {
      presenceSnapshot = null;
      onStoreChange();
    }
  };
  // bfcache / tab resume: re-read so Realm never sticks on SSR default "open"
  const onResume = () => {
    presenceSnapshot = null;
    onStoreChange();
  };
  window.addEventListener("virilion-presence", onCustom);
  window.addEventListener("storage", onStorage);
  window.addEventListener("pageshow", onResume);
  window.addEventListener("focus", onResume);
  return () => {
    window.removeEventListener("virilion-presence", onCustom);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("pageshow", onResume);
    window.removeEventListener("focus", onResume);
  };
}

export function setPresenceAndNotify(mode: PresenceMode): void {
  setPresence(mode);
  notifyPresenceListeners();
}
