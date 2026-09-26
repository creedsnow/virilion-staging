/** Deploy-safe public asset URLs (files under public/assets). Do not invent missing art. */

export function codexPeopleCardSm(peopleId: string): string {
  return `/assets/codex/codex-peoples-${peopleId}-card-sm.webp`;
}

export function codexClassCardSm(classId: string): string {
  return `/assets/codex/codex-classes-${classId}-card-sm.webp`;
}

export function peopleIcon(peopleId: string, theme: "dark" | "light" = "dark"): string {
  const suffix = theme === "light" ? "-light" : "";
  return `/assets/icons/peoples/${peopleId}${suffix}.svg`;
}

export function classIcon(classId: string, theme: "dark" | "light" = "dark"): string {
  const suffix = theme === "light" ? "-light" : "";
  return `/assets/icons/classes/${classId}${suffix}.svg`;
}
