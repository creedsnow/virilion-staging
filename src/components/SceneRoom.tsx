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
  const bottomRef = useRef<HTMLDivElement>(null);

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

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    postSceneMessage(scene.id, vessel, text);
    setText("");
    reload();
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)]">
      <div className="room-chrome px-4 py-3.5 mb-3">
        <div className="room-chrome-sheen" aria-hidden />
        <div className="relative z-[1] flex items-start justify-between gap-2">
          <div className="min-w-0">
            <button
              type="button"
              className="text-xs text-gold mb-1 hover:text-gold-soft"
              onClick={onBack}
            >
              ← Scenes
            </button>
            <h1 className="font-display text-xl font-semibold text-fg leading-tight">
              {scene.title}
            </h1>
            <p className="text-xs text-fg-muted mt-0.5">
              ✦ {scene.place} · Present as{" "}
              <span className="text-gold-soft font-medium">{vessel.name}</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.12em] text-fg-muted mt-1.5">
              In-app text · Join call = voice here · 18+ · present as Vessel
            </p>
            <p className="text-[10px] text-fg-muted/75 mt-1.5 tracking-wide">
              Chat stays in this browser until shared backend.
            </p>
          </div>
          <button
            type="button"
            className="btn-gold text-xs py-2 px-3 shrink-0 !min-h-0 !rounded-xl"
            onClick={() => setVoiceOpen(true)}
          >
            Join call
          </button>
        </div>
      </div>

      <div className="scene-log flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.length === 0 ? (
          <div className="scene-empty text-center py-12 px-4">
            <p className="section-kicker mb-2">Quiet room</p>
            <p className="font-display text-xl text-gold-soft mb-2">
              The lamps are lit. No one has spoken yet.
            </p>
            <p className="text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
              Open this scene in another tab to demo multi-vessel chat (same browser).
              Present as your Vessel. Consent before escalation. Never Discord-as-home.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="relative group scene-bubble">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-gold-soft font-display">
                  {m.vesselName}
                </span>
                <div className="flex items-center gap-2">
                  <time
                    className="text-[10px] text-fg-muted tabular-nums"
                    dateTime={m.at}
                    title={new Date(m.at).toLocaleString()}
                  >
                    {new Date(m.at).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </time>
                  <button
                    type="button"
                    className="text-[10px] text-fg-muted opacity-60 hover:opacity-100 px-1 min-h-[28px]"
                    onClick={() => setMenuId(menuId === m.id ? null : m.id)}
                    aria-label="Message actions"
                  >
                    ···
                  </button>
                </div>
              </div>
              <p className="text-sm text-fg whitespace-pre-wrap mt-0.5 leading-relaxed">
                {m.text}
              </p>
              {menuId === m.id && m.vesselId !== vessel.id ? (
                <div className="absolute right-0 top-5 z-10 card py-2 px-2 space-y-1 shadow-lg text-xs">
                  <button
                    type="button"
                    className="block w-full text-left px-2 py-1 hover:text-gold"
                    onClick={() => {
                      reportStub(scene.id, m.vesselId, "player report");
                      setMenuId(null);
                      alert("Report saved locally (demo). GM review later.");
                    }}
                  >
                    Report
                  </button>
                  <button
                    type="button"
                    className="block w-full text-left px-2 py-1 hover:text-danger"
                    onClick={() => {
                      blockVessel(m.vesselId);
                      setMenuId(null);
                      reload();
                    }}
                  >
                    Block
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="scene-composer flex gap-2">
        <input
          className="input flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message as ${vessel.name}…`}
          maxLength={1000}
        />
        <button type="submit" className="btn-gold px-4" disabled={!text.trim()}>
          Send
        </button>
      </form>
      <p className="text-[10px] text-fg-muted/80 mt-1.5 text-center">
        On another vessel&apos;s message, tap ··· for Report or Block (saved locally in this demo).
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
