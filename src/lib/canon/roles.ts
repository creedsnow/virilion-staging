import type { RoleId } from "../types";

export interface RoleOption {
  id: RoleId;
  name: string;
  note: string;
}

export const ROLES: RoleOption[] = [
  { id: "top", name: "Top", note: "Cannot carry the Blessing. Sorns unavailable." },
  { id: "verse", name: "Verse", note: "May open to the Blessing. Serynth & Sorns unavailable." },
  { id: "bottom", name: "Bottom", note: "May open to the Blessing. Serynth unavailable." },
];
