import type { DemoPlayer, Vessel } from "./types";

const KEYS = {
  ageOk: "virilion_age_ok",
  theme: "virilion_theme",
  player: "virilion_demo_player",
  vessel: "virilion_vessel",
  pending: "virilion_pending_vessels",
  presence: "virilion_presence",
} as const;

export type ThemeMode = "dark" | "light";

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

export type PresenceMode = "open" | "scene" | "unseen";

export function getPresence(): PresenceMode {
  if (!canUseStorage()) return "open";
  const v = localStorage.getItem(KEYS.presence);
  if (v === "scene" || v === "unseen" || v === "open") return v;
  return "open";
}

export function setPresence(mode: PresenceMode): void {
  if (!canUseStorage()) return;
  localStorage.setItem(KEYS.presence, mode);
}
