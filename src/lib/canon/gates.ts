import { PEOPLES, getPeople } from "./peoples";
import { BEAR_BANNED, DADDY_BANNED, STYLES } from "./styles";
import type { ClassId, PeopleId, RoleId, StyleId } from "../types";

/** Peoples available for a role. Hard locks: Sorns Bottom-only; Serynth Top-only. */
export function peoplesForRole(role: RoleId): PeopleId[] {
  const ids = PEOPLES.map((p) => p.id as PeopleId);
  if (role === "top") {
    return [...ids.filter((id) => id !== "sorns"), "custom"];
  }
  if (role === "verse") {
    return [...ids.filter((id) => id !== "serynth" && id !== "sorns"), "custom"];
  }
  // bottom
  return [...ids.filter((id) => id !== "serynth"), "custom"];
}

/** Can-carry toggle: Verse/Bottom only; hidden for Top and for Serynth. */
export function showCanCarry(role: RoleId, people: PeopleId | null): boolean {
  if (role === "top") return false;
  if (people === "serynth") return false;
  return role === "verse" || role === "bottom";
}

/**
 * Styles allowed for a People, applying §4.1 lists + Daddy/Bear gates.
 * Custom People: all styles including Custom (GM).
 */
export function stylesForPeople(people: PeopleId): StyleId[] {
  if (people === "custom") {
    return STYLES.map((s) => s.id);
  }
  const p = getPeople(people);
  if (!p) return [];

  const base = new Set<StyleId>(p.styles);
  // Daddy: allowed for all except Smols (separate from Bear)
  if (!DADDY_BANNED.has(people)) {
    base.add("daddy");
  } else {
    base.delete("daddy");
  }
  // Bear bans (unchanged)
  if (BEAR_BANNED.has(people)) {
    base.delete("bear");
  }
  // Always offer Custom (GM)
  base.add("custom");
  // Preserve display order from STYLES
  return STYLES.map((s) => s.id).filter((id) => base.has(id));
}

export function styleBlockedReason(people: PeopleId, style: StyleId): string | null {
  const allowed = stylesForPeople(people);
  if (allowed.includes(style)) return null;
  if (style === "daddy" && DADDY_BANNED.has(people)) {
    return "Smols cannot walk Daddy. Try Twink or Otter, or ask for Custom (GM).";
  }
  if (style === "bear" && BEAR_BANNED.has(people)) {
    return "This People doesn't walk Bear. Try another, or ask for Custom (GM).";
  }
  return "This People doesn't walk that Style. Try another, or ask for Custom (GM).";
}

export function softWarnKaelirTinker(people: PeopleId, classId: ClassId): string | null {
  if (people === "kaelir" && classId === "tinker") {
    return "Kaelir are rarely Tinkers — soft lore note, not a hard block.";
  }
  return null;
}

export function needsGmApproval(
  people: PeopleId,
  style: StyleId,
  classId: ClassId
): boolean {
  return people === "custom" || style === "custom" || classId === "custom";
}

export const FILTERED_STYLE_HINT =
  "This People doesn't walk that Style. Try another, or ask for Custom (GM).";
