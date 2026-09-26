import { PEOPLES } from "./peoples";
import { ORDER_HALLS } from "./orderHalls";

export type MapKind = "hub" | "homeland" | "wastes";

export interface MapRegion {
  id: string;
  label: string;
  short: string;
  kind: MapKind;
  color: string;
  peopleId?: string;
  culture?: string;
  note: string;
  /** SVG polygon points in viewBox 0 0 360 260 */
  points: string;
  cx: number;
  cy: number;
}

/**
 * Canon places from DESIGN_UI_LOCKS + ORDER_HALLS map pins.
 * Do not invent holdings. Layout is illustrative color-region, not atlas.
 */
export const MAP_REGIONS: MapRegion[] = [
  {
    id: "starveil",
    label: "The Starveil Sanctums",
    short: "STARVEIL",
    kind: "homeland",
    color: "#4a3a8b",
    peopleId: "auralith",
    culture: "Auralithi",
    note: "Homeland of the Auralithi · Luminara Noctis. Starbound Memory. Blood Hideaway rests in the night district.",
    points: "18,28 78,18 98,52 72,78 22,68",
    cx: 56,
    cy: 48,
  },
  {
    id: "stormspire",
    label: "The Stormspire Aeries",
    short: "STORM SPIRE",
    kind: "homeland",
    color: "#5a7ab8",
    peopleId: "valkary",
    culture: "Valkari",
    note: "Homeland of the Valkari · Aeryndor. Skyclaim rides the aeries.",
    points: "108,16 168,12 188,48 152,72 102,58",
    cx: 144,
    cy: 42,
  },
  {
    id: "wastes",
    label: "The Wastes",
    short: "THE WASTES",
    kind: "wastes",
    color: "#6b5a48",
    note: "Ash and silence. Bell Hall Ruins stands alone here — Warlock Order Hall.",
    points: "198,20 268,14 292,54 248,78 188,62",
    cx: 238,
    cy: 46,
  },
  {
    id: "velkrath",
    label: "Velkrath Wood",
    short: "VELKRATH",
    kind: "homeland",
    color: "#8b6b9e",
    peopleId: "varkyn",
    culture: "Varkari",
    note: "Homeland of the Varkari. Moonshift. The Wolfclad Lodge clears its own grove.",
    points: "12,88 68,78 88,118 58,148 18,128",
    cx: 48,
    cy: 112,
  },
  {
    id: "high-mountains",
    label: "The High Mountains",
    short: "HIGH MTS",
    kind: "homeland",
    color: "#6b8e4e",
    peopleId: "galands",
    culture: "Galands",
    note: "Homeland of the Galands. Earthrend. Hall of the Elements crowns a peak shrine.",
    points: "98,82 158,74 178,114 138,142 92,122",
    cx: 132,
    cy: 108,
  },
  {
    id: "trahg",
    label: "The Caverns of Trahg",
    short: "TRAHG",
    kind: "homeland",
    color: "#8b7355",
    peopleId: "trahgs",
    culture: "Trahgonians",
    note: "Homeland of the Trahgonians. Diamond Skin under stone glow.",
    points: "188,78 252,70 278,112 238,142 182,120",
    cx: 228,
    cy: 106,
  },
  {
    id: "virelios",
    label: "Virelios",
    short: "VIRELIOS",
    kind: "hub",
    color: "#c9a227",
    note: "Open hub capital — all Peoples welcome. Not Cassanova. Faith quarter, Undercity, Bardwook, Market/Pub host Order Halls.",
    points: "118,128 178,118 208,158 168,188 112,168",
    cx: 156,
    cy: 152,
  },
  {
    id: "grove",
    label: "The Grove",
    short: "THE GROVE",
    kind: "homeland",
    color: "#7b68c8",
    peopleId: "charms",
    culture: "Charmish",
    note: "Homeland of the Charmish. Deep Grove holds The Secret Wilds — Druid Order Hall.",
    points: "18,158 72,148 92,188 58,218 22,198",
    cx: 52,
    cy: 182,
  },
  {
    id: "war-colleges",
    label: "The War Colleges",
    short: "WAR COLLEGES",
    kind: "homeland",
    color: "#4a7c59",
    peopleId: "orks",
    culture: "Orkish",
    note: "Homeland of the Orkish. Crusaders' Hall and The Mead Halls stand as sibling campuses.",
    points: "98,178 158,168 178,208 138,232 92,212",
    cx: 132,
    cy: 198,
  },
  {
    id: "cassanova",
    label: "Cassanova",
    short: "CASSANOVA",
    kind: "homeland",
    color: "#c9a227",
    peopleId: "cassens",
    culture: "Cassenans",
    note: "Homeland of the Cassenans. Self Preservation. Steamwhistle College is in the city.",
    points: "188,168 252,158 278,198 238,228 182,208",
    cx: 228,
    cy: 190,
  },
  {
    id: "treetops",
    label: "The Treetop Villages",
    short: "TREETOPS",
    kind: "homeland",
    color: "#e8a0bf",
    peopleId: "smols",
    culture: "Smolish",
    note: "Homeland of the Smolish. Duplicate, up to 3. Daddy style banned.",
    points: "18,218 78,208 98,248 52,258 12,242",
    cx: 52,
    cy: 234,
  },
  {
    id: "stone-halls",
    label: "The Stone Halls",
    short: "STONE HALLS",
    kind: "homeland",
    color: "#5c6b7a",
    peopleId: "dwemen",
    culture: "Dwemish",
    note: "Homeland of the Dwemish. Stone Warden. Sacred Crypts and Golem University stand in the mountains.",
    points: "108,228 168,218 192,252 148,262 98,250",
    cx: 142,
    cy: 242,
  },
  {
    id: "southern-isles",
    label: "The Southern Isles",
    short: "S. ISLES",
    kind: "homeland",
    color: "#3d8b9e",
    peopleId: "sorns",
    culture: "Sorns",
    note: "Homeland of the Sorns — Bottom-only. Siren Call. Monastery of the Fist stands alone.",
    points: "208,228 268,218 292,252 248,262 198,250",
    cx: 242,
    cy: 244,
  },
  {
    id: "lush-plains",
    label: "Greater Lush Plains",
    short: "LUSH PLAINS",
    kind: "homeland",
    color: "#c4783a",
    peopleId: "rhovar",
    culture: "Rhovari",
    note: "Homeland of the Rhovari · Veyrhorn. Groundbreaker.",
    points: "288,88 348,78 358,128 318,148 278,122",
    cx: 318,
    cy: 112,
  },
  {
    id: "verdant",
    label: "The Verdant Canopy",
    short: "VERDANT",
    kind: "homeland",
    color: "#2d8a5e",
    peopleId: "kaelir",
    culture: "Kaelari",
    note: "Homeland of the Kaelari · Veyratha. Prowlstep.",
    points: "288,148 348,138 358,188 318,208 278,182",
    cx: 318,
    cy: 172,
  },
  {
    id: "suncoil",
    label: "The Suncoil Reaches",
    short: "SUNCOIL",
    kind: "homeland",
    color: "#b85c38",
    peopleId: "serynth",
    culture: "Serynthi",
    note: "Homeland of the Serynthi · Vaelssara. Twincoil. Top-only; cannot hold Blessing.",
    points: "288,198 348,188 358,238 318,252 278,228",
    cx: 318,
    cy: 218,
  },
];

export function hallsForRegion(regionId: string) {
  return ORDER_HALLS.filter((h) => h.regionId === regionId);
}

export function peopleColor(peopleId: string): string | undefined {
  return PEOPLES.find((p) => p.id === peopleId)?.mapColor;
}
