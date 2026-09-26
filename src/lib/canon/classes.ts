import type { ClassId } from "../types";

export interface GameClass {
  id: ClassId;
  name: string;
  orderHall: string;
  blurb: string;
}

export const CLASSES: GameClass[] = [
  { id: "mage", name: "Mage", orderHall: "The Arcane Academy", blurb: "Arcane power, spellwork, raw magical force." },
  { id: "druid", name: "Druid", orderHall: "The Secret Wilds", blurb: "Nature, wild power, healing, transformation." },
  { id: "rogue", name: "Rogue", orderHall: "Thieves' Hall", blurb: "Secrets, speed, deception, precision." },
  { id: "hunter", name: "Hunter", orderHall: "The Wolfclad Lodge", blurb: "Precision, wilderness, patience, instinct." },
  { id: "priest", name: "Priest", orderHall: "Dawn's Chapel", blurb: "Faith, healing, ritual, protection." },
  { id: "paladin", name: "Paladin", orderHall: "Crusaders' Hall", blurb: "Oath, protection, righteous force." },
  { id: "warlock", name: "Warlock", orderHall: "Bell Hall Ruins", blurb: "Pacts, shadows, bargains, temptation." },
  { id: "warrior", name: "Warrior", orderHall: "The Mead Halls", blurb: "Strength, endurance, discipline." },
  { id: "tinker", name: "Tinker", orderHall: "Steamwhistle College", blurb: "Machines, repairs, traps, clever solutions." },
  { id: "bard", name: "Bard", orderHall: "The Bellsong Auditorium", blurb: "Music, charm, story, presence." },
  { id: "monk", name: "Monk", orderHall: "The Monastery of the Fist", blurb: "Body control, inner power, focus." },
  { id: "shaman", name: "Shaman", orderHall: "Hall of the Elements", blurb: "Spirits, elements, ancestors, totems." },
  { id: "necromancer", name: "Necromancer", orderHall: "The Sacred Crypts", blurb: "Death, spirits, bones, memory." },
  { id: "golemancer", name: "Golemancer", orderHall: "Golem University", blurb: "Stone, clay, metal, runes, protection." },
  { id: "custom", name: "Custom", orderHall: "—", blurb: "GM approval required." },
];
