import type { DemoPlayer, PresenceMode, Vessel } from "./types";

const KEYS = {
  ageOk: "virilion_age_ok",
  theme: "virilion_theme",
  player: "virilion_demo_player",
  vessel: "virilion_vessel",
  pending: "virilion_pending_vessels",
  /** Canonical presence key (v1). Legacy `virilion_presence` is migrated on read. */
  presence: "virilion_presence_v1",
  presenceLegacy: "virilion_presence",
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

export function getTheme(): ThemeMode {
  if (!canUseStorage()) return "dark";
  const t = localStorage.getItem(KEYS.theme);
  return t === "light" ? "light" : "dark";
}

export function setTheme(theme: ThemeMode): void {
  if (!canUseStorage()) return;
  localStorage.setItem(KEYS.theme, theme);
  document.documentElement.setAttribute("data-theme", theme);
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

export function getPresence(): PresenceMode {
  if (!canUseStorage()) return "open";

  const primary = normalizePresence(localStorage.getItem(KEYS.presence));
  if (primary) return primary;

  const legacy = normalizePresence(localStorage.getItem(KEYS.presenceLegacy));
  if (legacy) {
    // Migrate legacy key forward so refresh keeps the choice.
    localStorage.setItem(KEYS.presence, legacy);
    return legacy;
  }

  try {
    const vessel = getVessel();
    const mirrored = normalizePresence(vessel?.presence ?? null);
    if (mirrored) {
      localStorage.setItem(KEYS.presence, mirrored);
      return mirrored;
    }
  } catch {
    /* ignore */
  }

  return "open";
}

export function setPresence(mode: PresenceMode): void {
  if (!canUseStorage()) return;
  localStorage.setItem(KEYS.presence, mode);
  // Drop legacy key so nothing re-reads a stale Open.
  localStorage.removeItem(KEYS.presenceLegacy);
  // Mirror onto vessel JSON so presence survives key churn.
  try {
    const vessel = getVessel();
    if (vessel && vessel.presence !== mode) {
      setVessel({ ...vessel, presence: mode });
    }
  } catch {
    /* ignore */
  }
}

/** Subscribe to presence changes (same-tab custom event + cross-tab storage). */
export function subscribePresence(onStoreChange: () => void): () => void {
  if (!canUseStorage()) return () => undefined;
  const onCustom = () => onStoreChange();
  const onStorage = (e: StorageEvent) => {
    if (
      e.key === KEYS.presence ||
      e.key === KEYS.presenceLegacy ||
      e.key === KEYS.vessel
    ) {
      onStoreChange();
    }
  };
  window.addEventListener("virilion-presence", onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("virilion-presence", onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

export function setPresenceAndNotify(mode: PresenceMode): void {
  setPresence(mode);
  if (canUseStorage()) {
    window.dispatchEvent(new Event("virilion-presence"));
  }
}
