import { getPeople } from "./canon/peoples";
import { STYLES } from "./canon/styles";
import { CLASSES } from "./canon/classes";
import type { ClassId, PeopleId, StyleId } from "./types";

export function assemblePrompt(opts: {
  name: string;
  people: PeopleId;
  peopleCustom?: string;
  style: StyleId;
  styleCustom?: string;
  classId: ClassId;
  classCustom?: string;
  bio?: string;
}): string {
  const peopleName =
    opts.people === "custom"
      ? opts.peopleCustom || "Custom people"
      : getPeople(opts.people)?.name || opts.people;
  const style =
    STYLES.find((s) => s.id === opts.style)?.promptBody ||
    opts.styleCustom ||
    "as described";
  const className =
    opts.classId === "custom"
      ? opts.classCustom || "Custom class"
      : CLASSES.find((c) => c.id === opts.classId)?.name || opts.classId;
  const appearance = (opts.bio || "").slice(0, 300) || "tasteful fantasy attire";

  return `Photorealistic cinematic film still from a high-budget fantasy film. Portrait of ${opts.name}, an adult man in his late 20s, of the ${peopleName} people of Virilion. ${style} build. He is a ${className}. ${appearance}. Setting: Virelios, the open capital, at violet dusk. Shot on a full-frame cinema camera, 85mm lens, shallow depth of field, warm lantern key light from upper left, cool moonlight rim, subtle film grain, real skin texture with pores.
Negative: no text, no letters, no logos, no watermark, no nudity, no genitals, no women, no teenagers or childlike faces, no modern objects, no plastic or airbrushed skin, no painting or illustration look, no extra fingers.`;
}
