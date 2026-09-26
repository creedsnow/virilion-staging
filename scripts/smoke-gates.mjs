/**
 * Canon gate smoke — mirrors src/lib/canon/gates.ts + styles bans.
 * Run: node scripts/smoke-gates.mjs
 */
const PEOPLES = [
  "cassens","charms","smols","galands","orks","trahgs","dwemen","sorns",
  "varkyn","rhovar","kaelir","serynth","auralith","valkary",
];

function peoplesForRole(role) {
  if (role === "top") return [...PEOPLES.filter((id) => id !== "sorns"), "custom"];
  if (role === "verse")
    return [...PEOPLES.filter((id) => id !== "serynth" && id !== "sorns"), "custom"];
  return [...PEOPLES.filter((id) => id !== "serynth"), "custom"];
}

const DADDY_BANNED = new Set(["smols"]);
const BEAR_BANNED = new Set(["smols", "trahgs", "kaelir", "serynth"]);

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(PEOPLES.length === 14, "Exactly 14 Peoples");
assert(!peoplesForRole("top").includes("sorns"), "Top cannot pick Sorns");
assert(peoplesForRole("top").includes("serynth"), "Top can pick Serynth");
assert(!peoplesForRole("verse").includes("sorns"), "Verse cannot pick Sorns");
assert(!peoplesForRole("verse").includes("serynth"), "Verse cannot pick Serynth");
assert(peoplesForRole("bottom").includes("sorns"), "Bottom can pick Sorns");
assert(!peoplesForRole("bottom").includes("serynth"), "Bottom cannot pick Serynth");
assert(DADDY_BANNED.has("smols"), "Smols cannot pick Daddy");
assert(BEAR_BANNED.has("smols"), "Smols cannot pick Bear");
assert(
  BEAR_BANNED.has("trahgs") && BEAR_BANNED.has("kaelir") && BEAR_BANNED.has("serynth"),
  "Bear bans"
);

console.log("smoke-gates: ok (Top/Verse/Smols locks)");
