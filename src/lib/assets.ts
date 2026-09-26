/** Deploy-safe public asset URLs (files under public/assets). Do not invent missing art. */

/** Map canon MAP_REGIONS.id → codex-places-*-card-sm slug (only when file exists). */
const PLACE_CARD_SLUG: Record<string, string> = {
  starveil: "starveil-sanctums",
  stormspire: "stormspire-aeries",
  wastes: "wastes",
  velkrath: "velkrath-wood",
  "high-mountains": "high-mountains",
  trahg: "caverns-of-trahg",
  virelios: "virelios",
  grove: "grove",
  "war-colleges": "war-colleges",
  cassanova: "cassanova",
  treetops: "treetop-villages",
  "stone-halls": "stone-halls",
  "southern-isles": "southern-isles",
  "lush-plains": "greater-lush-plains",
  verdant: "verdant-canopy",
  suncoil: "suncoil-reaches",
};

/**
 * Map ORDER_HALLS.id → codex-halls-*-card-sm slug.
 * Card filenames drop a leading "the-" that some hall ids keep.
 */
const HALL_CARD_SLUG: Record<string, string> = {
  "dawns-chapel": "dawns-chapel",
  "crusaders-hall": "crusaders-hall",
  "hall-of-the-elements": "hall-of-the-elements",
  "thieves-hall": "thieves-hall",
  "the-mead-halls": "mead-halls",
  "the-arcane-academy": "arcane-academy",
  "the-secret-wilds": "secret-wilds",
  "bell-hall-ruins": "bell-hall-ruins",
  "the-sacred-crypts": "sacred-crypts",
  "golem-university": "golem-university",
  "the-bellsong-auditorium": "bellsong-auditorium",
  "the-wolfclad-lodge": "wolfclad-lodge",
  "steamwhistle-college": "steamwhistle-college",
  "the-monastery-of-the-fist": "monastery-of-the-fist",
  "the-blood-hideaway": "blood-hideaway",
};

/** Bottom-nav / chrome ui/*.svg names that are shipped in the first batch. */
const UI_ICON_IDS = new Set([
  "realm",
  "map",
  "d20",
  "scenes",
  "self",
  "codex",
  "more",
  "theme-dark",
  "theme-light",
  "homeland",
  "settings",
  "notifications",
  "guild",
  "calendar",
  "campaign",
  "quest",
  "roster",
  "vessel",
  "order-hall",
]);

export function codexPeopleCardSm(peopleId: string): string {
  return `/assets/codex/codex-peoples-${peopleId}-card-sm.webp`;
}

export function codexClassCardSm(classId: string): string {
  return `/assets/codex/codex-classes-${classId}-card-sm.webp`;
}

/** Returns card-sm URL when a matching place asset exists; otherwise null. */
export function codexPlaceCardSm(regionId: string): string | null {
  const slug = PLACE_CARD_SLUG[regionId];
  if (!slug) return null;
  return `/assets/codex/codex-places-${slug}-card-sm.webp`;
}

/** Returns card-sm URL when a matching hall asset exists; otherwise null. */
export function codexHallCardSm(hallId: string): string | null {
  const slug = HALL_CARD_SLUG[hallId];
  if (!slug) return null;
  return `/assets/codex/codex-halls-${slug}-card-sm.webp`;
}

export function peopleIcon(peopleId: string, theme: "dark" | "light" = "dark"): string {
  const suffix = theme === "light" ? "-light" : "";
  return `/assets/icons/peoples/${peopleId}${suffix}.svg`;
}

export function classIcon(classId: string, theme: "dark" | "light" = "dark"): string {
  const suffix = theme === "light" ? "-light" : "";
  return `/assets/icons/classes/${classId}${suffix}.svg`;
}

/** Hall badge icons use the canon hall id (incl. leading "the-" where present). */
export function hallIcon(hallId: string, theme: "dark" | "light" = "dark"): string {
  const suffix = theme === "light" ? "-light" : "";
  return `/assets/icons/halls/${hallId}${suffix}.svg`;
}

/** UI line icon path, or null if that name is not in the known first-batch set. */
export function uiIcon(name: string): string | null {
  if (!UI_ICON_IDS.has(name)) return null;
  return `/assets/icons/ui/${name}.svg`;
}
