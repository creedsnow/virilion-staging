import type { StyleId } from "../types";

export interface BodyStyle {
  id: StyleId;
  name: string;
  note?: string;
  promptBody: string;
}

export const STYLES: BodyStyle[] = [
  { id: "twink", name: "Twink", promptBody: "slim, graceful" },
  { id: "muscle", name: "Muscle", promptBody: "powerfully muscular" },
  { id: "otter", name: "Otter", promptBody: "lean, hairy, wiry" },
  { id: "wolf", name: "Wolf", promptBody: "rugged, lean, hairy" },
  { id: "chub", name: "Chub", promptBody: "soft, heavy, strong" },
  { id: "bear", name: "Bear", promptBody: "big, broad, hairy" },
  {
    id: "daddy",
    name: "Daddy",
    note: "Separate from Bear — Smols banned only",
    promptBody: "mature, self-assured, silver-touched",
  },
  {
    id: "custom",
    name: "Custom",
    note: "GM approval required",
    promptBody: "as described",
  },
];

/** Peoples that cannot take Bear (STYLE_DADDY_GATE). */
export const BEAR_BANNED = new Set(["smols", "trahgs", "kaelir", "serynth"]);

/** Daddy banned for Smols only. */
export const DADDY_BANNED = new Set(["smols"]);
