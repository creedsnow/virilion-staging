"use client";

import Image from "next/image";
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
  isQaMode,
  setPlayer,
  setVessel,
  wipeVesselForDemo,
} from "@/lib/storage";
import { saveVesselToServer } from "@/lib/auth-client";
import { codexClassCardSm, codexPeopleCardSm } from "@/lib/assets";
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
  const [qa, setQa] = useState(false);
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
  const [showThreshold, setShowThreshold] = useState(false);
  const [completing, setCompleting] = useState<"approved" | "pending_gm" | null>(null);

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
    setQa(isQaMode());
    try {
      const flag = sessionStorage.getItem("virilion_threshold");
      if (flag === "enter-rite") {
        setShowThreshold(true);
        sessionStorage.removeItem("virilion_threshold");
      }
    } catch {
      /* ignore */
    }
    setBooted(true);
  }, []);

  useEffect(() => {
    if (!completing) return;
    const t = window.setTimeout(() => {
      router.replace("/dash");
    }, 2400);
    return () => window.clearTimeout(t);
  }, [completing, router]);

  if (!booted) {
    return <p className="text-sm text-fg-muted">Opening the Rite…</p>;
  }

  if (completing) {
    const pending = completing === "pending_gm";
    return (
      <div className="rite-threshold text-center space-y-4">
        <p className="section-kicker">
          {pending ? "Held at the gate" : "The Rite is sealed"}
        </p>
        <h1 className="font-display text-3xl font-semibold text-gold-soft leading-tight">
          {pending ? "Awaiting GM blessing" : "Cross into the Realm"}
        </h1>
        <p className="text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
          {pending
            ? "Your custom character waits under soft lamps. The Realm opens — approve on Self or /admin when ready."
            : "One character embodied. The lamps of Virelios are lit for him."}
        </p>
        <div className="threshold-progress mx-auto" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <button type="button" className="btn-gold" onClick={() => router.replace("/dash")}>
          Enter the Realm
        </button>
      </div>
    );
  }

  // One vessel lock — no second vessel CTA; demo wipe is QA-only retake
  if (existing) {
    return (
      <div className="rite-hero text-center space-y-4">
        <p className="section-kicker">Rite of Making</p>
        <h1 className="font-display text-3xl font-semibold text-gold-soft">One character</h1>
        <p className="text-sm text-fg-muted leading-relaxed">
          You already embody <strong className="text-fg">{existing.name}</strong>.
          Virilion is one character per player — no second slot.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <button type="button" className="btn-gold" onClick={() => router.replace("/dash")}>
            Return to Realm
          </button>
          {qa ? (
            <button
              type="button"
              className="btn-ghost text-sm border-danger/40 text-danger"
              onClick={() => {
                if (
                  confirm(
                    "Demo QA only: wipe this character and retake the Rite? Not a second character — the one-character lock stays."
                  )
                ) {
                  wipeVesselForDemo();
                  setExisting(null);
                  setStep(0);
                  setRole(null);
                  setCanCarry(false);
                  setPeople(null);
                  setPeopleCustom("");
                  setStyle(null);
                  setStyleCustom("");
                  setClassId(null);
                  setClassCustom("");
                  setName("");
                  setBio("");
                  setError("");
                }
              }}
            >
              Demo: wipe & retake Rite
            </button>
          ) : null}
        </div>
        {qa ? (
          <p className="text-[10px] text-fg-muted/75 leading-relaxed max-w-sm mx-auto">
            QA path only · clears local demo character so tile selection and People lore can be re-tested.
          </p>
        ) : null}
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
    // Real accounts: mirror vessel into Neon when a session cookie is present.
    void saveVesselToServer(vessel);
    try {
      sessionStorage.setItem(
        "virilion_threshold",
        pending ? "rite-pending" : "rite-complete"
      );
      sessionStorage.removeItem("virilion_arrived");
    } catch {
      /* ignore */
    }
    setCompleting(pending ? "pending_gm" : "approved");
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

  const roleMeta = role ? ROLES.find((r) => r.id === role) : null;

  const stepTitles: Record<number, string> = {
    0: "His role",
    1: "The Blessing",
    2: "His People",
    3: "His style",
    4: "His class",
    5: "His name",
    6: "Seal the Rite",
  };
  const stepHints: Record<number, string> = {
    0: "Role comes first — Peoples locked to a role stay veiled until then.",
    1: "Sacred, consent-gated, never automatic. Defaults off.",
    2: "Fourteen Peoples — card, lore, homeland. No Veilborn. Custom → GM.",
    3: "Styles filtered by People. Daddy ≠ Bear. Daddy banned for Smols only.",
    4: "Each class ties to an Order Hall. Custom → GM.",
    5: "Public face in the Realm — keep him clearly adult.",
    6: "One character only. Confirm, then cross the threshold.",
  };

  if (showThreshold) {
    return (
      <div className="rite-threshold text-center space-y-4">
        <p className="section-kicker">You have crossed</p>
        <h1 className="font-display text-3xl font-semibold text-gold-soft leading-tight">
          The Rite of Making
        </h1>
        <p className="text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
          Shape one character — role, People, style, class, name — then step into a living Realm.
          One character only.
        </p>
        <div className="threshold-progress mx-auto" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <button
          type="button"
          className="btn-gold"
          onClick={() => setShowThreshold(false)}
        >
          Begin the crossing
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 rite-chamber">
      <div className="rite-progress-head">
        <div className="flex items-baseline justify-between gap-3">
          <p className="section-kicker mb-0">
            Crossing · {step + 1} of {STEPS.length}
          </p>
          <p className="rite-step-label">{STEPS[step]}</p>
        </div>
        <div className="rite-progress-track" aria-hidden>
          {STEPS.map((s, i) => (
            <span
              key={s}
              title={s}
              className="rite-progress-bead"
              data-state={i < step ? "done" : i === step ? "active" : "idle"}
            />
          ))}
        </div>
      </div>

      <div>
        <h1 className="rite-step-title">
          {stepTitles[step]}
        </h1>
        <p className="rite-step-hint">
          {stepHints[step]}
        </p>
      </div>

      {error ? (
        <p className="text-sm text-danger border border-danger/40 rounded-lg px-3 py-2 bg-danger/5">
          {error}
        </p>
      ) : null}

      {step === 0 && (
        <div className="space-y-3">
          <div className="space-y-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                className="role-pick"
                data-active={role === r.id}
                aria-pressed={role === r.id}
                onClick={() => onSelectRole(r.id)}
              >
                <span className="min-w-0 text-left">
                  <span className="rite-role-name">
                    {r.name}
                  </span>
                  <span className="text-sm text-fg-muted">{r.note}</span>
                </span>
                <span
                  className="role-check"
                  aria-hidden
                  data-on={role === r.id}
                >
                  {role === r.id ? "✓" : ""}
                </span>
              </button>
            ))}
          </div>
          {roleMeta ? (
            <p className="gate-note">{roleMeta.gate}</p>
          ) : (
            <p className="gate-note">
              <strong className="text-gold-soft">Role first</strong> filters Peoples.
              Sorns appear for Bottom only; Serynth for Top only. Verse cannot pick either.
            </p>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          {carryVisible || role === "verse" || role === "bottom" ? (
            <>
              <label className="role-pick cursor-pointer" data-active={canCarry}>
                <span className="min-w-0 text-left flex-1">
                  <span className="font-medium text-fg block">
                    Open to the Blessing of Continuation
                  </span>
                  <span className="text-xs text-fg-muted leading-relaxed block mt-1">
                    Sacred, consent-gated, never automatic. A Game Master may grant it in
                    story; a Sorn may bestow it through ritual. Does not grant Bearer status
                    at creation.
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-gold mt-2 block">
                    {canCarry ? "On · still not a Bearer" : "Off · does not make him a Bearer"}
                  </span>
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={canCarry}
                  onChange={(e) => setCanCarry(e.target.checked)}
                />
                <span
                  className="rite-toggle"
                  data-on={canCarry}
                  aria-hidden
                />
              </label>
              <p className="text-xs text-fg-muted">
                Hidden for Top and for Serynth. Defaults off.
              </p>
            </>
          ) : (
            <p className="gate-note">Can carry does not apply to Top.</p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="gate-note">
            Fourteen Peoples. No Veilborn.
            {role === "bottom" ? (
              <> <strong className="text-gold-soft">Sorns</strong> · Bottom-only.</>
            ) : null}
            {role === "top" ? (
              <> <strong className="text-gold-soft">Serynth</strong> · Top-only.</>
            ) : null}
            {role === "verse" ? <> Sorns & Serynth locked for Verse.</> : null}
          </p>
          <div className="rite-choice-grid">
            {allowedPeople.map((id) => {
              const p = PEOPLES.find((x) => x.id === id);
              const label = id === "custom" ? "Custom" : p?.name || id;
              const lore =
                id === "custom"
                  ? "GM approval required · describe your People"
                  : p
                    ? p.lore
                    : "";
              const gift = id === "custom" ? "" : p ? `Gift · ${p.racialAbility}` : "";
              const home = id === "custom" ? "" : p?.homeland || "";
              const active = people === id;
              return (
                <button
                  key={id}
                  type="button"
                  className={`rite-choice${id !== "custom" ? " rite-choice-art" : ""}`}
                  data-active={active}
                  aria-pressed={active}
                  onClick={() => onSelectPeople(id)}
                >
                  <span className="rite-choice-seal" aria-hidden data-on={active}>
                    {active ? "✓" : ""}
                  </span>
                  {active ? (
                    <span className="rite-choice-selected-tag">Selected</span>
                  ) : null}
                  {id !== "custom" ? (
                    <span className="rite-choice-thumb" aria-hidden>
                      <Image
                        src={codexPeopleCardSm(id)}
                        alt=""
                        width={96}
                        height={120}
                        className="rite-choice-thumb-img"
                        sizes="72px"
                      />
                      <span className="rite-choice-thumb-veil" />
                    </span>
                  ) : null}
                  <span className="rite-choice-name">{label}</span>
                  {lore ? <span className="rite-choice-note">{lore}</span> : null}
                  {gift ? <span className="rite-choice-home">{gift}</span> : null}
                  {home ? <span className="rite-choice-home">{home}</span> : null}
                </button>
              );
            })}
          </div>
          {people === "sorns" ? (
            <p className="gate-warn">Sorns are Bottom-only — hard lock honored.</p>
          ) : null}
          {people === "serynth" ? (
            <p className="gate-warn">
              Serynth are Top-only — Can carry stays off.
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
          <p className="gate-note">
            Filtered by People. <strong className="text-fg">Daddy ≠ Bear</strong> · Daddy
            banned for Smols only.
          </p>
          <div className="rite-choice-grid">
            {STYLES.map((s) => {
              const allowed = allowedStyles.includes(s.id);
              const note = !allowed
                ? styleBlockedReason(people, s.id) || "Not available"
                : s.note || s.promptBody;
              return (
                <button
                  key={s.id}
                  type="button"
                  className="rite-choice"
                  data-active={style === s.id}
                  aria-pressed={style === s.id}
                  disabled={!allowed}
                  title={
                    allowed
                      ? s.note || s.name
                      : styleBlockedReason(people, s.id) || "Not available"
                  }
                  onClick={() => allowed && setStyle(s.id)}
                >
                  <span className="rite-choice-seal" aria-hidden data-on={style === s.id}>
                    {style === s.id ? "✓" : ""}
                  </span>
                  {style === s.id ? (
                    <span className="rite-choice-selected-tag">Selected</span>
                  ) : null}
                  <span className="rite-choice-name">{s.name}</span>
                  {note ? <span className="rite-choice-note">{note}</span> : null}
                </button>
              );
            })}
          </div>
          {people === "smols" ? (
            <p className="gate-warn">Daddy is banned for Smols — tiles are disabled.</p>
          ) : null}
          {style && !allowedStyles.includes(style) ? (
            <p className="text-sm text-danger">{styleBlockedReason(people, style)}</p>
          ) : null}
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
          <p className="gate-note">
            Tiles select class. Each ties to an Order Hall. Custom → GM approval.
          </p>
          <div className="rite-choice-grid">
            {CLASSES.map((c) => {
              const active = classId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`rite-choice${c.id !== "custom" ? " rite-choice-art" : ""}`}
                  data-active={active}
                  aria-pressed={active}
                  onClick={() => setClassId(c.id)}
                >
                  <span className="rite-choice-seal" aria-hidden data-on={active}>
                    {active ? "✓" : ""}
                  </span>
                  {active ? (
                    <span className="rite-choice-selected-tag">Selected</span>
                  ) : null}
                  {c.id !== "custom" ? (
                    <span className="rite-choice-thumb" aria-hidden>
                      <Image
                        src={codexClassCardSm(c.id)}
                        alt=""
                        width={96}
                        height={120}
                        className="rite-choice-thumb-img"
                        sizes="72px"
                      />
                      <span className="rite-choice-thumb-veil" />
                    </span>
                  ) : null}
                  <span className="rite-choice-name">{c.name}</span>
                  <span className="rite-choice-note">
                    {c.id === "custom" ? c.blurb : c.orderHall}
                  </span>
                  {c.id !== "custom" ? (
                    <span className="rite-choice-home">{c.blurb}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
          {kaelirWarn ? <p className="gate-warn">{kaelirWarn}</p> : null}
          {classId === "custom" ? (
            <input
              className="input"
              placeholder="Describe Custom Class for GM"
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
              Character name (required)
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
          <div className="card stone-panel rite-review-card rounded-2xl space-y-3 text-sm relative overflow-hidden">
            <span className="vessel-watermark" aria-hidden>
              V
            </span>
            <div className="flex gap-3.5 items-start relative z-[1]">
              <div className="rite-review-medallion" aria-hidden>
                {people && people !== "custom" ? (
                  <Image
                    src={codexPeopleCardSm(people)}
                    alt=""
                    width={120}
                    height={150}
                    className="rite-review-medallion-art"
                    sizes="76px"
                  />
                ) : (
                  <span className="relative z-[1] font-display text-[1.85rem] font-semibold text-gold-soft">
                    {(name.trim().charAt(0) || "V").toUpperCase()}
                  </span>
                )}
                <span className="rite-review-medallion-sheen" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="section-kicker mb-1">Character reveal</p>
                <h2 className="font-display text-[1.55rem] font-semibold text-gold-soft leading-tight">
                  {name.trim() || "Unnamed"}
                </h2>
                <p className="text-sm text-fg-muted mt-1 leading-snug">
                  {(people === "custom"
                    ? "Custom"
                    : PEOPLES.find((p) => p.id === people)?.name || people)}{" "}
                  ·{" "}
                  {(style === "custom"
                    ? "Custom"
                    : STYLES.find((s) => s.id === style)?.name || style)}{" "}
                  ·{" "}
                  {(classId === "custom"
                    ? "Custom"
                    : CLASSES.find((c) => c.id === classId)?.name || classId)}
                </p>
              </div>
            </div>
            <div className="space-y-2 relative z-[1] border-t border-border/55 pt-3">
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
            </div>
            {needsGmApproval(people, style, classId) ? (
              <p className="text-gold text-xs pt-1 border-t border-border/60 leading-relaxed relative z-[1]">
                Custom selection → <strong>pending_gm</strong>. You still cross into the Realm;
                approve later on Self or <strong>/admin</strong>.
              </p>
            ) : (
              <p className="text-ok text-xs pt-1 border-t border-border/60 relative z-[1]">
                Ready to embody — the threshold is open.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost text-sm" onClick={copyPrompt}>
              Generate Prompt (copy)
            </button>
          </div>
          {toast ? <p className="text-xs text-ok">{toast}</p> : null}
        </div>
      )}

      <div className="flex gap-3 pt-2 sticky bottom-2 z-10">
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
            Embody · enter the Realm
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
