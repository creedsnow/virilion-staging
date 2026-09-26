export interface OrderHall {
  name: string;
  channel: string;
  tiedTo: string;
  mapPlace: string;
}

export const ORDER_HALLS: OrderHall[] = [
  { name: "Dawn's Chapel", channel: "#dawns-chapel", tiedTo: "Priest", mapPlace: "Virelios (faith quarter)" },
  { name: "Crusaders' Hall", channel: "#crusaders-hall", tiedTo: "Paladin", mapPlace: "War Colleges region" },
  { name: "Hall of the Elements", channel: "#hall-of-the-elements", tiedTo: "Shaman", mapPlace: "High Mountains" },
  { name: "Thieves' Hall", channel: "#thieves-hall", tiedTo: "Rogue", mapPlace: "The Undercity (Virelios)" },
  { name: "The Mead Halls", channel: "#the-mead-halls", tiedTo: "Warrior", mapPlace: "War Colleges region" },
  { name: "The Arcane Academy", channel: "#the-arcane-academy", tiedTo: "Mage", mapPlace: "Virelios (near Bardwook)" },
  { name: "The Secret Wilds", channel: "#the-secret-wilds", tiedTo: "Druid", mapPlace: "Deep Grove" },
  { name: "Bell Hall Ruins", channel: "#bell-hall-ruins", tiedTo: "Warlock", mapPlace: "The Wastes" },
  { name: "The Sacred Crypts", channel: "#the-sacred-crypts", tiedTo: "Necromancer", mapPlace: "Stone Halls mountains" },
  { name: "Golem University", channel: "#golem-university", tiedTo: "Golemancer", mapPlace: "Stone Halls region" },
  { name: "The Bellsong Auditorium", channel: "#the-bellsong-auditorium", tiedTo: "Bard", mapPlace: "Virelios (Market/Pub)" },
  { name: "The Wolfclad Lodge", channel: "#the-wolfclad-lodge", tiedTo: "Hunter", mapPlace: "Velkrath Wood" },
  { name: "Steamwhistle College", channel: "#steamwhistle-college", tiedTo: "Tinker", mapPlace: "Cassanova" },
  { name: "The Monastery of the Fist", channel: "#the-monastery-of-the-fist", tiedTo: "Monk", mapPlace: "Southern Isles" },
  { name: "The Blood Hideaway", channel: "#the-blood-hideaway", tiedTo: "Vampires (affliction)", mapPlace: "Luminara Noctis" },
];
