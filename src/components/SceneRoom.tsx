"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Vessel } from "@/lib/types";
import {
  blockVessel,
  getBlocked,
  getSceneMessages,
  postSceneMessage,
  reportStub,
  type SceneInfo,
  type SceneMessage,
} from "@/lib/scenes";
import { VoicePanel } from "./VoicePanel";

function hueForVessel(id: string): string {
  const hues = ["#5a3d78", "#3d5a80", "#6b3d4a", "#3d6b58", "#6b5a3d", "#4a3d6b", "#3d5a58"];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % hues.length;
  return hues[h];
}

function formatSpeakTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SceneRoom({
  scene,
  vessel,
  onBack,
}: {
  scene: SceneInfo;
  vessel: Vessel;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<SceneMessage[]>([]);
  const [text, setText] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reload = useCallback(() => {
    const blocked = new Set(getBlocked());
    setMessages(getSceneMessages(scene.id).filter((m) => !blocked.has(m.vesselId)));
  }, [scene.id]);

  useEffect(() => {
    reload();
    const onEvt = (e: Event) => {
      if ((e as CustomEvent).detail === scene.id) reload();
    };
    window.addEventListener("virilion-scene-msg", onEvt);
    window.addEventListener("storage", reload);
    const tick = setInterval(reload, 1500);
    return () => {
      window.removeEventListener("virilion-scene-msg", onEvt);
      window.removeEventListener("storage", reload);
      clearInterval(tick);
    };
  }, [reload, scene.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    postSceneMessage(scene.id, vessel, text);
    setText("");
    reload();
    inputRef.current?.focus();
  }

  const initial = vessel.name.trim().charAt(0).toUpperCase() || "V";

  return (
    <div className="scene-chamber flex flex-col h-[calc(100dvh-8rem)]">
      <header className="room-chrome px-4 py-3.5 mb-3">
        <div className="room-chrome-sheen" aria-hidden />
        <div className="relative z-[1] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <button
              type="button"
              className="text-xs text-gold mb-1.5 hover:text-gold-soft inline-flex items-center gap-1"
              onClick={onBack}
            >
              ← Scenes
            </button>
            <div className="flex items-start gap-3">
              <span className="room-lamp-seal" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 3h6M10 3v2h4V3M8 7h8l1 3v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V10l1-3Z"
                    stroke="currentColor"
                    strokeWidth="1.55"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 10v5"
                    stroke="currentColor"
                    strokeWidth="1.55"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="section-kicker mb-0.5">In-app chamber</p>
                <h1 className="font-display text-xl font-semibold text-fg leading-tight">
                  {scene.title}
                </h1>
                <p className="text-xs text-fg-muted mt-1 leading-snug">
                  ✦ {scene.place}
                </p>
                <p className="text-[11px] text-fg-muted mt-1.5 leading-relaxed">
                  Present as{" "}
                  <span className="text-gold-soft font-medium">{vessel.name}</span>
                  {" · "}18+ · consent before escalation
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-gold text-xs py-2 px-3 shrink-0 !min-h-0 !rounded-xl"
            onClick={() => setVoiceOpen(true)}
          >
            Join call
          </button>
        </div>
      </header>

      <div className="story-log flex-1 overflow-y-auto mb-3" role="log" aria-live="polite">
        <div className="story-log-sheen" aria-hidden />
        <div className="story-log-inner relative z-[1]">
          <div className="story-room-note" role="note">
            <span className="story-room-note-mark" aria-hidden>
              ✦
            </span>
            <p>
              The lamps are lit. Speak as your Vessel. Chat stays in this browser until
              shared backend — Join call opens voice here, not Discord.
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="scene-empty text-center py-10 px-4">
              <span className="room-empty-lamp" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 3h6M10 3v2h4V3M8 7h8l1 3v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V10l1-3Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 10v5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <p className="section-kicker mb-2">Quiet chamber</p>
              <p className="font-display text-xl text-gold-soft mb-2 leading-snug">
                No one has spoken yet.
              </p>
              <p className="text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
                Ink the first line below — or open this scene in another tab to demo
                multi-vessel talk (same browser).
              </p>
            </div>
          ) : (
            <ul className="space-y-0">
              {messages.map((m) => {
                const mine = m.vesselId === vessel.id;
                const hue = hueForVessel(m.vesselId);
                const seal = m.vesselName.trim().charAt(0).toUpperCase() || "·";
                return (
                  <li
                    key={m.id}
                    className="story-line"
                    data-mine={mine ? "true" : "false"}
                  >
                    <div
                      className="story-seal"
                      style={{
                        background: `linear-gradient(145deg, color-mix(in srgb, ${hue} 55%, #1a1028), #121018 78%)`,
                      }}
                      aria-hidden
                    >
                      <span className="relative z-[1]">{seal}</span>
                    </div>
                    <div className="story-line-body min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2 min-w-0">
                          <span className="font-display text-[1.05rem] font-semibold text-gold-soft truncate">
                            {m.vesselName}
                          </span>
                          {mine ? (
                            <span className="story-you-pill">You</span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <time
                            className="text-[10px] text-fg-muted tabular-nums"
                            dateTime={m.at}
                            title={new Date(m.at).toLocaleString()}
                          >
                            {formatSpeakTime(m.at)}
                          </time>
                          {!mine ? (
                            <button
                              type="button"
                              className="story-menu-btn"
                              onClick={() => setMenuId(menuId === m.id ? null : m.id)}
                              aria-label="Message actions"
                              aria-expanded={menuId === m.id}
                            >
                              ···
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <p className="story-text whitespace-pre-wrap">{m.text}</p>
                      {menuId === m.id ? (
                        <div className="story-action-menu card py-1.5 px-1.5 space-y-0.5 shadow-lg">
                          <button
                            type="button"
                            className="story-action"
                            onClick={() => {
                              reportStub(scene.id, m.vesselId, "player report");
                              setMenuId(null);
                              setToast("Report saved locally · GM review later");
                            }}
                          >
                            Report
                          </button>
                          <button
                            type="button"
                            className="story-action story-action-danger"
                            onClick={() => {
                              blockVessel(m.vesselId);
                              setMenuId(null);
                              setToast("Vessel blocked in this browser");
                              reload();
                            }}
                          >
                            Block
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {toast ? (
        <p className="story-toast" role="status">
          {toast}
        </p>
      ) : null}

      <form onSubmit={send} className="story-composer">
        <div className="story-composer-seal" aria-hidden>
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="scene-speak">
            Speak as {vessel.name}
          </label>
          <input
            id="scene-speak"
            ref={inputRef}
            className="story-composer-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Speak as ${vessel.name}…`}
            maxLength={1000}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="btn-gold px-4 !min-h-0 !rounded-xl text-sm py-2.5"
          disabled={!text.trim()}
        >
          Speak
        </button>
      </form>
      <p className="text-[10px] text-fg-muted/75 mt-1.5 text-center leading-relaxed">
        On another vessel&apos;s line, tap ··· for Report or Block (local demo).
      </p>

      {voiceOpen ? (
        <VoicePanel
          sceneId={scene.id}
          sceneTitle={scene.title}
          vessel={vessel}
          onClose={() => setVoiceOpen(false)}
        />
      ) : null}
    </div>
  );
}
