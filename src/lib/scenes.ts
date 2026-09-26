import type { Vessel } from "./types";

export interface SceneInfo {
  id: string;
  title: string;
  place: string;
  vibe: string;
  seats: string;
  open: boolean;
}

export interface SceneMessage {
  id: string;
  sceneId: string;
  vesselName: string;
  vesselId: string;
  text: string;
  at: string;
  /** speak (default) · cast · system */
  kind?: "speak" | "cast" | "system";
}

export interface VoicePresence {
  vesselId: string;
  vesselName: string;
  muted: boolean;
  deafened: boolean;
  joinedAt: string;
}

const SCENES_KEY = "virilion_scene_messages";
const VOICE_KEY = "virilion_voice_presence";
const BLOCKED_KEY = "virilion_blocked_vessels";

export const DEMO_SCENES: SceneInfo[] = [
  {
    id: "virelios-lantern",
    title: "Lantern Walk",
    place: "Virelios — Market quarter",
    vibe: "Soft night stroll, open to bonds",
    seats: "Open",
    open: true,
  },
  {
    id: "velkrath-moon",
    title: "Moonshift Watch",
    place: "Velkrath Wood",
    vibe: "Quiet hunt, pack-friendly",
    seats: "Gathering · demo",
    open: true,
  },
  {
    id: "dawns-chapel-vigil",
    title: "Dawn Vigil",
    place: "Dawn's Chapel (Order Hall)",
    vibe: "Priest-led prayer circle",
    seats: "Open",
    open: true,
  },
  {
    id: "wastes-bell",
    title: "Bell Hall Echo",
    place: "The Wastes — Bell Hall Ruins",
    vibe: "Warlock pact talk — consent first",
    seats: "Gathering · demo",
    open: true,
  },
];

function canUse(): boolean {
  return typeof window !== "undefined";
}

function readJsonRecord<T>(key: string): Record<string, T> {
  if (!canUse()) return {};
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      localStorage.removeItem(key);
      return {};
    }
    return parsed as Record<string, T>;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return {};
  }
}

function writeJsonRecord<T>(key: string, value: Record<string, T>): void {
  if (!canUse()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — swallow so Speak / Join never crash the room */
  }
}

export function getSceneMessages(sceneId: string): SceneMessage[] {
  if (!canUse()) return [];
  const all = readJsonRecord<SceneMessage[]>(SCENES_KEY);
  return (all[sceneId] || []).sort((a, b) => a.at.localeCompare(b.at));
}

export function postSceneMessage(
  sceneId: string,
  vessel: Vessel,
  text: string
): SceneMessage {
  const msg: SceneMessage = {
    id: crypto.randomUUID(),
    sceneId,
    vesselName: vessel.name,
    vesselId: vessel.id,
    text: text.trim(),
    at: new Date().toISOString(),
  };
  return pushSceneMessage(sceneId, msg);
}

function pushSceneMessage(sceneId: string, msg: SceneMessage): SceneMessage {
  const all = readJsonRecord<SceneMessage[]>(SCENES_KEY);
  const list = all[sceneId] || [];
  list.push(msg);
  all[sceneId] = list.slice(-200);
  writeJsonRecord(SCENES_KEY, all);
  try {
    window.dispatchEvent(new CustomEvent("virilion-scene-msg", { detail: sceneId }));
  } catch {
    /* ignore */
  }
  return msg;
}

/** Stamp a scene-visibility d20 cast into the room feed. */
export function postSceneCast(
  sceneId: string,
  vessel: Vessel,
  value: number
): SceneMessage {
  return pushSceneMessage(sceneId, {
    id: crypto.randomUUID(),
    sceneId,
    vesselName: vessel.name,
    vesselId: vessel.id,
    text: `Cast the d20 · scene · ${value}`,
    at: new Date().toISOString(),
    kind: "cast",
  });
}

export function getVoicePresence(sceneId: string): VoicePresence[] {
  if (!canUse()) return [];
  const all = readJsonRecord<VoicePresence[]>(VOICE_KEY);
  return all[sceneId] || [];
}

export function upsertVoicePresence(sceneId: string, presence: VoicePresence): void {
  if (!canUse()) return;
  const all = readJsonRecord<VoicePresence[]>(VOICE_KEY);
  const list = (all[sceneId] || []).filter((p) => p.vesselId !== presence.vesselId);
  list.push(presence);
  all[sceneId] = list;
  writeJsonRecord(VOICE_KEY, all);
  try {
    window.dispatchEvent(new CustomEvent("virilion-voice", { detail: sceneId }));
  } catch {
    /* ignore */
  }
}

export function leaveVoice(sceneId: string, vesselId: string): void {
  if (!canUse()) return;
  const all = readJsonRecord<VoicePresence[]>(VOICE_KEY);
  all[sceneId] = (all[sceneId] || []).filter((p) => p.vesselId !== vesselId);
  writeJsonRecord(VOICE_KEY, all);
  try {
    window.dispatchEvent(new CustomEvent("virilion-voice", { detail: sceneId }));
  } catch {
    /* ignore */
  }
}

export function getBlocked(): string[] {
  if (!canUse()) return [];
  try {
    const raw = localStorage.getItem(BLOCKED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function blockVessel(vesselId: string): void {
  if (!canUse()) return;
  const set = new Set(getBlocked());
  set.add(vesselId);
  try {
    localStorage.setItem(BLOCKED_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function reportStub(sceneId: string, vesselId: string, note: string): void {
  if (!canUse()) return;
  const key = "virilion_reports";
  let list: unknown[] = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch {
    list = [];
  }
  list.push({ sceneId, vesselId, note, at: new Date().toISOString() });
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}


/** Build a place-scoped room from a map region (SceneRoom reuse). */
export function sceneForPlace(opts: {
  id: string;
  label: string;
  note: string;
  kind: string;
}): SceneInfo {
  return {
    id: `place-${opts.id}`,
    title: opts.label,
    place: opts.kind === "hub" ? "Open hub · everyone" : opts.kind === "wastes" ? "Wild holding" : "Homeland · place room",
    vibe: opts.note,
    seats: "Demo cast",
    open: true,
  };
}

/** Build a hall-scoped room from an Order Hall. */
export function sceneForHall(opts: {
  id: string;
  name: string;
  mapPlace: string;
  tiedTo: string;
}): SceneInfo {
  return {
    id: `hall-${opts.id}`,
    title: opts.name,
    place: `Order Hall · ${opts.mapPlace}`,
    vibe: `Class circle for ${opts.tiedTo}`,
    seats: "Demo cast",
    open: true,
  };
}
