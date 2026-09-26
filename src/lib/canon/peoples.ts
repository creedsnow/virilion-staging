import type { PeopleId, StyleId } from "../types";

export interface People {
  id: Exclude<PeopleId, "custom">;
  name: string;
  cultureName: string;
  homeland: string;
  capital?: string;
  racialAbility: string;
  /** Base styles from DESIGN_SIGNUP_VESSEL §4.1 (before Daddy gate). */
  styles: StyleId[];
  mapColor: string;
  roleNote?: string;
}

/** Exactly 14 Peoples. No Veilborn. */
export const PEOPLES: People[] = [
  {
    id: "cassens",
    name: "Cassens",
    cultureName: "Cassenans",
    homeland: "Cassanova",
    capital: "Cassanova",
    racialAbility: "Self Preservation",
    styles: ["twink", "muscle", "otter", "wolf", "chub", "bear"],
    mapColor: "#c9a227",
  },
  {
    id: "charms",
    name: "Charms",
    cultureName: "Charmish",
    homeland: "The Grove",
    racialAbility: "Bonus Mana and Energy Regeneration",
    styles: ["twink", "muscle", "otter", "wolf", "chub", "bear"],
    mapColor: "#7b68c8",
  },
  {
    id: "smols",
    name: "Smols",
    cultureName: "Smolish",
    homeland: "The Treetop Villages",
    racialAbility: "Duplicate, up to 3",
    styles: ["twink", "otter"],
    mapColor: "#e8a0bf",
  },
  {
    id: "galands",
    name: "Galands",
    cultureName: "Galands",
    homeland: "The High Mountains",
    racialAbility: "Earthrend",
    styles: ["muscle", "wolf", "chub", "bear"],
    mapColor: "#6b8e4e",
  },
  {
    id: "orks",
    name: "Orks",
    cultureName: "Orkish",
    homeland: "The War Colleges",
    racialAbility: "Chameleon",
    styles: ["twink", "muscle", "otter", "wolf", "chub", "bear"],
    mapColor: "#4a7c59",
  },
  {
    id: "trahgs",
    name: "Trahgs",
    cultureName: "Trahgonians",
    homeland: "The Caverns of Trahg",
    racialAbility: "Diamond Skin",
    styles: ["twink", "muscle", "otter", "wolf"],
    mapColor: "#8b7355",
  },
  {
    id: "dwemen",
    name: "Dwemen",
    cultureName: "Dwemish",
    homeland: "The Stone Halls",
    racialAbility: "Stone Warden",
    styles: ["twink", "muscle", "otter", "wolf", "chub", "bear"],
    mapColor: "#5c6b7a",
  },
  {
    id: "sorns",
    name: "Sorns",
    cultureName: "Sorns",
    homeland: "The Southern Isles",
    racialAbility: "Siren Call",
    styles: ["twink", "muscle", "otter", "wolf", "chub", "bear"],
    mapColor: "#3d8b9e",
    roleNote: "Bottom-only (hard lock)",
  },
  {
    id: "varkyn",
    name: "Varkyn",
    cultureName: "Varkari",
    homeland: "Velkrath Wood",
    racialAbility: "Moonshift",
    styles: ["twink", "muscle", "otter", "wolf", "chub", "bear", "custom"],
    mapColor: "#8b6b9e",
  },
  {
    id: "rhovar",
    name: "Rhovar",
    cultureName: "Rhovari",
    homeland: "Greater Lush Plains / Veyrhorn",
    racialAbility: "Groundbreaker",
    styles: ["muscle", "wolf", "chub", "bear", "custom"],
    mapColor: "#c4783a",
  },
  {
    id: "kaelir",
    name: "Kaelir",
    cultureName: "Kaelari",
    homeland: "The Verdant Canopy / Veyratha",
    racialAbility: "Prowlstep",
    styles: ["twink", "otter", "muscle", "wolf"],
    mapColor: "#2d8a5e",
  },
  {
    id: "serynth",
    name: "Serynth",
    cultureName: "Serynthi",
    homeland: "The Suncoil Reaches / Vaelssara",
    racialAbility: "Twincoil",
    styles: ["twink", "muscle", "chub"],
    mapColor: "#b85c38",
    roleNote: "Top-only; cannot hold Blessing",
  },
  {
    id: "auralith",
    name: "Auralith",
    cultureName: "Auralithi",
    homeland: "The Starveil Sanctums / Luminara Noctis",
    racialAbility: "Starbound Memory",
    styles: ["twink", "muscle", "otter", "wolf", "chub", "bear", "custom"],
    mapColor: "#4a3a8b",
  },
  {
    id: "valkary",
    name: "Valkary",
    cultureName: "Valkari",
    homeland: "The Stormspire Aeries / Aeryndor",
    capital: "Aeryndor",
    racialAbility: "Skyclaim",
    styles: ["twink", "muscle", "otter", "wolf", "chub", "bear"],
    mapColor: "#5a7ab8",
  },
];

export function getPeople(id: PeopleId): People | undefined {
  if (id === "custom") return undefined;
  return PEOPLES.find((p) => p.id === id);
}
