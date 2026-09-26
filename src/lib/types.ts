export type RoleId = "top" | "verse" | "bottom";
export type PeopleId =
  | "cassens"
  | "charms"
  | "smols"
  | "galands"
  | "orks"
  | "trahgs"
  | "dwemen"
  | "sorns"
  | "varkyn"
  | "rhovar"
  | "kaelir"
  | "serynth"
  | "auralith"
  | "valkary"
  | "custom";

export type StyleId =
  | "twink"
  | "muscle"
  | "otter"
  | "wolf"
  | "chub"
  | "bear"
  | "daddy"
  | "custom";

export type ClassId =
  | "mage"
  | "druid"
  | "rogue"
  | "hunter"
  | "priest"
  | "paladin"
  | "warlock"
  | "warrior"
  | "tinker"
  | "bard"
  | "monk"
  | "shaman"
  | "necromancer"
  | "golemancer"
  | "custom";

export type VesselStatus = "approved" | "pending_gm";

export interface Vessel {
  id: string;
  name: string;
  role: RoleId;
  canCarry: boolean;
  people: PeopleId;
  peopleCustom?: string;
  style: StyleId;
  styleCustom?: string;
  classId: ClassId;
  classCustom?: string;
  bio?: string;
  status: VesselStatus;
  createdAt: string;
}

export interface DemoPlayer {
  screenName: string;
  enteredAt: string;
}
