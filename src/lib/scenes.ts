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

export function getSceneMessages(sceneId: string): SceneMessage[] {
  if (!canUse()) return [];
  try {
    const all = JSON.parse(localStorage.getItem(SCENES_KEY) || "{}") as Record<
      string,
      SceneMessage[]
    >;
    return (all[sceneId] || []).sort((a, b) => a.at.localeCompare(b.at));
  } catch {
    return [];
  }
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
  const all = JSON.parse(localStorage.getItem(SCENES_KEY) || "{}") as Record<
    string,
    SceneMessage[]
  >;
  const list = all[sceneId] || [];
  list.push(msg);
  all[sceneId] = list.slice(-200);
  localStorage.setItem(SCENES_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("virilion-scene-msg", { detail: sceneId }));
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
  try {
    const all = JSON.parse(localStorage.getItem(VOICE_KEY) || "{}") as Record<
      string,
      VoicePresence[]
    >;
    return all[sceneId] || [];
  } catch {
    return [];
  }
}

export function upsertVoicePresence(sceneId: string, presence: VoicePresence): void {
  if (!canUse()) return;
  const all = JSON.parse(localStorage.getItem(VOICE_KEY) || "{}") as Record<
    string,
    VoicePresence[]
  >;
  const list = (all[sceneId] || []).filter((p) => p.vesselId !== presence.vesselId);
  list.push(presence);
  all[sceneId] = list;
  localStorage.setItem(VOICE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("virilion-voice", { detail: sceneId }));
}

export function leaveVoice(sceneId: string, vesselId: string): void {
  if (!canUse()) return;
  const all = JSON.parse(localStorage.getItem(VOICE_KEY) || "{}") as Record<
    string,
    VoicePresence[]
  >;
  all[sceneId] = (all[sceneId] || []).filter((p) => p.vesselId !== vesselId);
  localStorage.setItem(VOICE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("virilion-voice", { detail: sceneId }));
}

export function getBlocked(): string[] {
  if (!canUse()) return [];
  try {
    return JSON.parse(localStorage.getItem(BLOCKED_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function blockVessel(vesselId: string): void {
  if (!canUse()) return;
  const set = new Set(getBlocked());
  set.add(vesselId);
  localStorage.setItem(BLOCKED_KEY, JSON.stringify([...set]));
}

export function reportStub(sceneId: string, vesselId: string, note: string): void {
  if (!canUse()) return;
  const key = "virilion_reports";
  const list = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
  list.push({ sceneId, vesselId, note, at: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(list));
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
