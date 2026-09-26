import type { RoleId } from "../types";

export interface RoleOption {
  id: RoleId;
  name: string;
  /** Short card line matching signup screenshots. */
  note: string;
  /** Gate banner under role step. */
  gate: string;
}

export const ROLES: RoleOption[] = [
  {
    id: "top",
    name: "Top",
    note: "Cannot carry the Blessing.",
    gate: "Sorns are Bottom only for now, so they won't be offered.",
  },
  {
    id: "verse",
    name: "Verse",
    note: "May be open to the Blessing.",
    gate: "Serynth are Top only and Sorns are Bottom only — neither offered for Verse.",
  },
  {
    id: "bottom",
    name: "Bottom",
    note: "May be open to the Blessing.",
    gate: "Serynth are Top only, so they won't be offered.",
  },
];
