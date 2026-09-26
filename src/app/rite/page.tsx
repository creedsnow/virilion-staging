"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PEOPLES } from "@/lib/canon/peoples";
import { CLASSES } from "@/lib/canon/classes";
import { STYLES } from "@/lib/canon/styles";
import { ROLES } from "@/lib/canon/roles";
import {
  needsGmApproval,
  peoplesForRole,
  showCanCarry,
  softWarnKaelirTinker,
  styleBlockedReason,
  stylesForPeople,
} from "@/lib/canon/gates";
import { assemblePrompt } from "@/lib/prompt";
import {
  addPendingVessel,
  getPlayer,
  getVessel,
  setPlayer,
  setVessel,
} from "@/lib/storage";
import type { ClassId, PeopleId, RoleId, StyleId, Vessel } from "@/lib/types";

const STEPS = [
  "Role",
  "Can carry",
  "People",
  "Style",
  "Class",
  "Name",
  "Review",
] as const;

export default function RitePage() {
  const router = useRouter();
  const [existing, setExisting] = useState<Vessel | null>(null);
  const [booted, setBooted] = useState(false);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<RoleId | null>(null);
  const [canCarry, setCanCarry] = useState(false);
  const [people, setPeople] = useState<PeopleId | null>(null);
  const [peopleCustom, setPeopleCustom] = useState("");
  const [style, setStyle] = useState<StyleId | null>(null);
  const [styleCustom, setStyleCustom] = useState("");
  const [classId, setClassId] = useState<ClassId | null>(null);
  const [classCustom, setClassCustom] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const allowedPeople = useMemo(
    () => (role ? peoplesForRole(role) : []),
    [role]
  );
  const allowedStyles = useMemo(
    () => (people ? stylesForPeople(people) : []),
    [people]
  );
  const carryVisible = role && people ? showCanCarry(role, people) : role ? showCanCarry(role, null) : false;
  const kaelirWarn =
    people && classId ? softWarnKaelirTinker(people, classId) : null;

  useEffect(() => {
    setExisting(getVessel());
    setBooted(true);
  }, []);

  if (!booted) {
    return <p className="text-sm text-fg-muted">Opening the Rite…</p>;
  }

  // One vessel lock
  if (existing) {
    return (
      <div className="card text-center space-y-4">
        <h1 className="text-xl font-semibold text-gold-soft">One vessel</h1>
        <p className="text-sm text-fg-muted">
          You already embody <strong className="text-fg">{existing.name}</strong>.
          Virilion is one vessel per player — no second slot.
        </p>
        <button type="button" className="btn-gold" onClick={() => router.replace("/")}>
          Return to Realm
        </button>
      </div>
    );
  }

  function ensurePlayer() {
    if (!getPlayer()) {
      setPlayer({ screenName: "Traveler", enteredAt: new Date().toISOString() });
    }
  }

  function next() {
    setError("");
    if (step === 0 && !role) {
      setError("Choose a Role.");
      return;
    }
    if (step === 1 && !carryVisible) {
      setStep(2);
      return;
    }
    if (step === 2 && !people) {
      setError("Choose a People.");
      return;
    }
    if (step === 2 && people === "custom" && !peopleCustom.trim()) {
      setError("Describe your Custom People for GM review.");
      return;
    }
    if (step === 3 && !style) {
      setError("Choose a Style.");
      return;
    }
    if (step === 3 && style === "custom" && !styleCustom.trim()) {
      setError("Describe your Custom Style for GM review.");
      return;
    }
    if (step === 3 && people && style) {
      const blocked = styleBlockedReason(people, style);
      if (blocked) {
        setError(blocked);
        return;
      }
    }
    if (step === 4 && !classId) {
      setError("Choose a Class.");
      return;
    }
    if (step === 4 && classId === "custom" && !classCustom.trim()) {
      setError("Describe your Custom Class for GM review.");
      return;
    }
    if (step === 5 && !name.trim()) {
      setError("Name is required.");
      return;
    }
    if (step === 0) {
      setCanCarry(false);
      setPeople(null);
      setStyle(null);
      // Top skips Can carry; Verse/Bottom see it
      setStep(role === "top" ? 2 : 1);
      return;
    }
    if (step === 1) {
      // If People later becomes Serynth, canCarry forced off on select
      setStep(2);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError("");
    if (step === 2 && role === "top") {
      setStep(0);
      return;
    }
    if (step === 2 && (role === "verse" || role === "bottom")) {
      setStep(1);
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  }

  function onSelectRole(r: RoleId) {
    setRole(r);
    setCanCarry(false);
    setPeople(null);
    setStyle(null);
    setClassId(null);
  }

  function onSelectPeople(p: PeopleId) {
    setPeople(p);
    setStyle(null);
    if (p === "serynth") setCanCarry(false);
  }

  function submit() {
    if (!role || !people || !style || !classId || !name.trim()) return;
    ensurePlayer();
    const pending = needsGmApproval(people, style, classId);
    const vessel: Vessel = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role,
      canCarry: showCanCarry(role, people) ? canCarry : false,
      people,
      peopleCustom: people === "custom" ? peopleCustom.trim() : undefined,
      style,
      styleCustom: style === "custom" ? styleCustom.trim() : undefined,
      classId,
      classCustom: classId === "custom" ? classCustom.trim() : undefined,
      bio: bio.trim() || undefined,
      status: pending ? "pending_gm" : "approved",
      createdAt: new Date().toISOString(),
    };
    setVessel(vessel);
    if (pending) addPendingVessel(vessel);
    router.replace("/");
  }

  function copyPrompt() {
    if (!role || !people || !style || !classId || !name.trim()) return;
    const text = assemblePrompt({
      name: name.trim(),
      people,
      peopleCustom,
      style,
      styleCustom,
      classId,
      classCustom,
      bio,
    });
    navigator.clipboard.writeText(text).then(() => {
      setToast("Prompt copied");
      setTimeout(() => setToast(""), 2000);
    });
  }

  const stepLabel = STEPS[step];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold mb-1">
          Rite of Making · Demo
        </p>
        <h1 className="text-2xl font-semibold text-fg">Forge your Vessel</h1>
        <p className="text-sm text-fg-muted mt-1">
          Step {step + 1} of {STEPS.length}: {stepLabel}. One vessel only. Adult male gay /
          male-attracted characters.
        </p>
      </div>

      <div className="flex gap-1 flex-wrap">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={`h-1.5 flex-1 min-w-6 rounded-full ${
              i <= step ? "bg-gold" : "bg-border"
            }`}
          />
        ))}
      </div>

      {error ? (
        <p className="text-sm text-danger border border-danger/40 rounded-lg px-3 py-2">
          {error}
        </p>
      ) : null}

      {step === 0 && (
        <div className="space-y-3">
          <p className="text-sm text-fg-muted">
            Role first filters Peoples (Sorns = Bottom-only; Serynth = Top-only).
          </p>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                className="chip"
                data-active={role === r.id}
                onClick={() => onSelectRole(r.id)}
              >
                {r.name}
              </button>
            ))}
          </div>
          {role ? (
            <p className="text-xs text-fg-muted">
              {ROLES.find((r) => r.id === role)?.note}
            </p>
          ) : null}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          {carryVisible || role === "verse" || role === "bottom" ? (
            <>
              <label className="flex items-start gap-3 card cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={canCarry}
                  onChange={(e) => setCanCarry(e.target.checked)}
                />
                <span>
                  <span className="font-medium text-fg block">
                    Open to the Blessing of Continuation
                  </span>
                  <span className="text-xs text-fg-muted leading-relaxed">
                    Sacred, consent-gated, never automatic. A Game Master may grant it in
                    story; a Sorn may bestow it through ritual. Does not grant Bearer status
                    at creation.
                  </span>
                </span>
              </label>
              <p className="text-xs text-fg-muted">
                Hidden for Top and for Serynth. Defaults off.
              </p>
            </>
          ) : (
            <p className="text-sm text-fg-muted">Can carry does not apply to Top.</p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm text-fg-muted">
            Exactly 14 Peoples. No Veilborn. Custom → GM approval.
          </p>
          <div className="flex flex-wrap gap-2">
            {allowedPeople.map((id) => {
              const p = PEOPLES.find((x) => x.id === id);
              const label = id === "custom" ? "Custom (GM)" : p?.name || id;
              return (
                <button
                  key={id}
                  type="button"
                  className="chip"
                  data-active={people === id}
                  onClick={() => onSelectPeople(id)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {people && people !== "custom" ? (
            <p className="text-xs text-fg-muted">
              {PEOPLES.find((p) => p.id === people)?.racialAbility} ·{" "}
              {PEOPLES.find((p) => p.id === people)?.homeland}
              {PEOPLES.find((p) => p.id === people)?.roleNote
                ? ` · ${PEOPLES.find((p) => p.id === people)?.roleNote}`
                : ""}
            </p>
          ) : null}
          {people === "custom" ? (
            <input
              className="input"
              placeholder="Describe Custom People"
              value={peopleCustom}
              onChange={(e) => setPeopleCustom(e.target.value)}
            />
          ) : null}
        </div>
      )}

      {step === 3 && people && (
        <div className="space-y-3">
          <p className="text-sm text-fg-muted">
            Styles filtered by People. Daddy ≠ Bear; Daddy banned for Smols only.
          </p>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => {
              const allowed = allowedStyles.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  className="chip"
                  data-active={style === s.id}
                  disabled={!allowed}
                  title={
                    allowed
                      ? s.note || s.name
                      : styleBlockedReason(people, s.id) || "Not available"
                  }
                  onClick={() => allowed && setStyle(s.id)}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
          {style === "custom" ? (
            <input
              className="input"
              placeholder="Custom style (Prince, Brute, Doll…)"
              value={styleCustom}
              onChange={(e) => setStyleCustom(e.target.value)}
            />
          ) : null}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {CLASSES.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                data-active={classId === c.id}
                onClick={() => setClassId(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          {kaelirWarn ? (
            <p className="text-xs text-gold border border-gold/30 rounded-lg px-3 py-2">
              {kaelirWarn}
            </p>
          ) : null}
          {classId && classId !== "custom" ? (
            <p className="text-xs text-fg-muted">
              {CLASSES.find((c) => c.id === classId)?.blurb} Order Hall:{" "}
              {CLASSES.find((c) => c.id === classId)?.orderHall}
            </p>
          ) : null}
          {classId === "custom" ? (
            <input
              className="input"
              placeholder="Custom class (GM)"
              value={classCustom}
              onChange={(e) => setClassCustom(e.target.value)}
            />
          ) : null}
        </div>
      )}

      {step === 5 && (
        <div className="space-y-3">
          <div>
            <label className="label" htmlFor="vname">
              Vessel name (required)
            </label>
            <input
              id="vname"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Public face in the Realm"
              maxLength={40}
            />
          </div>
          <div>
            <label className="label" htmlFor="bio">
              Bio stub (optional)
            </label>
            <textarea
              id="bio"
              className="input min-h-24"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Appearance / personality — keep him clearly adult"
              maxLength={500}
            />
          </div>
        </div>
      )}

      {step === 6 && role && people && style && classId && (
        <div className="space-y-4">
          <div className="card space-y-2 text-sm">
            <Row label="Name" value={name} />
            <Row label="Role" value={role} />
            <Row
              label="Can carry"
              value={
                showCanCarry(role, people)
                  ? canCarry
                    ? "Open to Blessing"
                    : "Off"
                  : "N/A"
              }
            />
            <Row
              label="People"
              value={
                people === "custom"
                  ? `Custom: ${peopleCustom}`
                  : PEOPLES.find((p) => p.id === people)?.name || people
              }
            />
            <Row
              label="Style"
              value={
                style === "custom"
                  ? `Custom: ${styleCustom}`
                  : STYLES.find((s) => s.id === style)?.name || style
              }
            />
            <Row
              label="Class"
              value={
                classId === "custom"
                  ? `Custom: ${classCustom}`
                  : CLASSES.find((c) => c.id === classId)?.name || classId
              }
            />
            {bio ? <Row label="Bio" value={bio} /> : null}
            {needsGmApproval(people, style, classId) ? (
              <p className="text-gold text-xs pt-2">
                Custom selection → status pending_gm until a GM approves (see Self / Admin).
              </p>
            ) : (
              <p className="text-ok text-xs pt-2">Ready to embody — no GM gate needed.</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost text-sm" disabled title="Coming soon">
              Randomize (Coming soon)
            </button>
            <button type="button" className="btn-ghost text-sm" onClick={copyPrompt}>
              Generate Prompt (copy)
            </button>
          </div>
          {toast ? <p className="text-xs text-ok">{toast}</p> : null}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {step > 0 ? (
          <button type="button" className="btn-ghost" onClick={back}>
            Back
          </button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn-gold flex-1" onClick={next}>
            Continue
          </button>
        ) : (
          <button type="button" className="btn-gold flex-1" onClick={submit}>
            Submit Vessel
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-fg-muted">{label}</span>
      <span className="text-fg text-right capitalize">{value}</span>
    </div>
  );
}
