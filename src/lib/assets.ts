/** Deploy-safe public asset URLs (files under public/assets). Do not invent missing art. */

/** Map canon MAP_REGIONS.id → codex-places-*-card slug (only when file exists). */
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
 * Map ORDER_HALLS.id → codex-halls-*-card slug.
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
  "join-call",
  "voice-lit",
  "chat",
  "party",
]);

/** Full-size Codex people card (800×1000). Prefer for Codex grids + Realm medallion. */
export function codexPeopleCard(peopleId: string): string {
  return `/assets/codex/codex-peoples-${peopleId}-card.webp`;
}

/** Thumb / Rite tile — smaller decode. */
export function codexPeopleCardSm(peopleId: string): string {
  return `/assets/codex/codex-peoples-${peopleId}-card-sm.webp`;
}

/** Full-size Codex class card. Prefer for Codex class rows. */
export function codexClassCard(classId: string): string {
  return `/assets/codex/codex-classes-${classId}-card.webp`;
}

/** Thumb / Rite tile. */
export function codexClassCardSm(classId: string): string {
  return `/assets/codex/codex-classes-${classId}-card-sm.webp`;
}

/** Full place card when a matching asset exists; otherwise null. */
export function codexPlaceCard(regionId: string): string | null {
  const slug = PLACE_CARD_SLUG[regionId];
  if (!slug) return null;
  return `/assets/codex/codex-places-${slug}-card.webp`;
}

/** Thumb place card when a matching asset exists; otherwise null. */
export function codexPlaceCardSm(regionId: string): string | null {
  const slug = PLACE_CARD_SLUG[regionId];
  if (!slug) return null;
  return `/assets/codex/codex-places-${slug}-card-sm.webp`;
}

/** Full hall card when a matching asset exists; otherwise null. */
export function codexHallCard(hallId: string): string | null {
  const slug = HALL_CARD_SLUG[hallId];
  if (!slug) return null;
  return `/assets/codex/codex-halls-${slug}-card.webp`;
}

/** Thumb hall card when a matching asset exists; otherwise null. */
export function codexHallCardSm(hallId: string): string | null {
  const slug = HALL_CARD_SLUG[hallId];
  if (!slug) return null;
  return `/assets/codex/codex-halls-${slug}-card-sm.webp`;
}

/** Realm News hero — prefer 1200×675 for phone/web. */
export function newsVoiceVideoHero(size: "1200" | "full" = "1200"): string {
  return size === "full"
    ? "/assets/news/news-voice-video-live-hero.webp"
    : "/assets/news/news-voice-video-live-hero-1200x675.webp";
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

/** Moonmarket dice skins (Batch A4). Shop UI deferred post-launch; Casting Bowl still uses these. */
export const MOONMARKET_SKINS = [
  { id: "night-court", label: "Night Court", blurb: "Obsidian set under velvet lamps" },
  { id: "starveil", label: "Starveil", blurb: "Starlit resin · soft aurora edge" },
  { id: "gilded-coil", label: "Gilded Coil", blurb: "Brass & emerald coil · Virelios seal" },
  { id: "parchment-bone", label: "Parchment Bone", blurb: "Bone ivory · script-ready faces" },
  { id: "mosswood", label: "Mosswood", blurb: "Living wood · grove-touched grain" },
] as const;

/** Moonmarket single-shape die shots. */
export const MOONMARKET_DIES = [
  { id: "d4", label: "d4" },
  { id: "d6", label: "d6" },
  { id: "d8", label: "d8" },
  { id: "d10", label: "d10" },
  { id: "d12", label: "d12" },
  { id: "dpercent", label: "d%" },
] as const;

/** Prefer 800² webp for shop cards. */
export function moonmarketSkin(id: string, size: "full" | "800" = "800"): string {
  const suffix = size === "800" ? "-800" : "";
  return `/assets/moonmarket/shop-skin-${id}${suffix}.webp`;
}

export function moonmarketDie(id: string, size: "full" | "800" = "800"): string {
  const suffix = size === "800" ? "-800" : "";
  return `/assets/moonmarket/shop-die-${id}${suffix}.webp`;
}

/** Wisp loops — UI deferred post-launch; packs kept in public/assets/wisps/. */
export type WispLoop = "idle" | "greet" | "notify" | "pet" | "poke";

export function wispWebm(loop: WispLoop): string {
  return `/assets/wisps/wisp-${loop}.webm`;
}

export function wispApng(loop: WispLoop): string {
  return `/assets/wisps/wisp-${loop}.apng`;
}

/** Reduced-motion / poster still. Prefer 256 for panel hero, 128 for mote. */
export function wispStill(size: 128 | 256 = 256): string {
  return size === 128
    ? "/assets/wisps/wisp-still-128.webp"
    : "/assets/wisps/wisp-still-256.webp";
}

/** Prefer full hall card, else full place card, from scene art ids (denser lobby thumbs). */
export function sceneLobbyArt(opts: {
  placeId?: string;
  hallId?: string;
}): string | null {
  if (opts.hallId) {
    const hall = codexHallCard(opts.hallId);
    if (hall) return hall;
  }
  if (opts.placeId) return codexPlaceCard(opts.placeId);
  return null;
}
