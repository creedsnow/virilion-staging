"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Vessel } from "@/lib/types";
import {
  getVoicePresence,
  leaveVoice,
  upsertVoicePresence,
  type VoicePresence,
} from "@/lib/scenes";

/**
 * Basic in-app voice shell for staging.
 * - getUserMedia mic
 * - Mute / Deafen / Leave
 * - localStorage presence (multi-tab same browser)
 * - RTCPeerConnection loopback demo so audio path is real locally
 * No Discord. WebRTC mesh signaling comes later.
 */
export function VoicePanel({
  sceneId,
  sceneTitle,
  vessel,
  onClose,
}: {
  sceneId: string;
  sceneTitle: string;
  vessel: Vessel;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting");
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [level, setLevel] = useState(0);
  const [roster, setRoster] = useState<VoicePresence[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const refreshRoster = useCallback(() => {
    setRoster(getVoicePresence(sceneId));
  }, [sceneId]);

  useEffect(() => {
    refreshRoster();
    const onEvt = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d === sceneId) refreshRoster();
    };
    window.addEventListener("virilion-voice", onEvt);
    window.addEventListener("storage", refreshRoster);
    const tick = setInterval(refreshRoster, 2000);
    return () => {
      window.removeEventListener("virilion-voice", onEvt);
      window.removeEventListener("storage", refreshRoster);
      clearInterval(tick);
    };
  }, [sceneId, refreshRoster]);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      setStatus("connecting");
      setError("");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const pc1 = new RTCPeerConnection();
        const pc2 = new RTCPeerConnection();
        pcRef.current = pc1;
        stream.getTracks().forEach((t) => pc1.addTrack(t, stream));
        pc2.ontrack = (ev) => {
          if (audioRef.current) {
            audioRef.current.srcObject = ev.streams[0];
            audioRef.current.muted = true;
          }
        };
        pc1.onicecandidate = (e) => e.candidate && pc2.addIceCandidate(e.candidate);
        pc2.onicecandidate = (e) => e.candidate && pc1.addIceCandidate(e.candidate);
        const offer = await pc1.createOffer();
        await pc1.setLocalDescription(offer);
        await pc2.setRemoteDescription(offer);
        const answer = await pc2.createAnswer();
        await pc2.setLocalDescription(answer);
        await pc1.setRemoteDescription(answer);

        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        analyserRef.current = analyser;
        const data = new Uint8Array(analyser.frequencyBinCount);
        const pump = () => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          setLevel(Math.min(100, Math.round(avg)));
          rafRef.current = requestAnimationFrame(pump);
        };
        pump();

        upsertVoicePresence(sceneId, {
          vesselId: vessel.id,
          vesselName: vessel.name,
          muted: false,
          deafened: false,
          joinedAt: new Date().toISOString(),
        });
        setStatus("live");
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof Error
            ? err.message
            : "Microphone permission denied or unavailable"
        );
      }
    }

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      pcRef.current?.close();
      pcRef.current = null;
      leaveVoice(sceneId, vessel.id);
    };
  }, [sceneId, vessel.id, vessel.name]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !next && !deafened;
    });
    upsertVoicePresence(sceneId, {
      vesselId: vessel.id,
      vesselName: vessel.name,
      muted: next,
      deafened,
      joinedAt:
        roster.find((r) => r.vesselId === vessel.id)?.joinedAt ||
        new Date().toISOString(),
    });
  }

  function toggleDeafen() {
    const next = !deafened;
    setDeafened(next);
    if (audioRef.current) audioRef.current.muted = next || true;
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !muted && !next;
    });
    upsertVoicePresence(sceneId, {
      vesselId: vessel.id,
      vesselName: vessel.name,
      muted,
      deafened: next,
      joinedAt:
        roster.find((r) => r.vesselId === vessel.id)?.joinedAt ||
        new Date().toISOString(),
    });
  }

  function leave() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    leaveVoice(sceneId, vessel.id);
    onClose();
  }

  return (
    <div className="voice-sheet fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="voice-panel w-full max-w-md space-y-4">
        <div className="voice-panel-glow" aria-hidden />
        <div className="relative z-[1] flex items-start justify-between gap-3">
          <div>
            <p className="section-kicker mb-1">In-app voice</p>
            <h2 className="font-display text-xl font-semibold text-fg leading-tight">
              {sceneTitle}
            </h2>
            <p className="text-[11px] text-fg-muted mt-1">
              Stays in Virilion · never Discord-as-home
            </p>
            <p className="text-[10px] text-fg-muted/75 mt-1.5 tracking-wide">
              Voice stays in this browser until shared backend.
            </p>
          </div>
          <button type="button" className="btn-ghost text-xs py-1.5 px-2.5 !min-h-0" onClick={leave}>
            Close
          </button>
        </div>

        {status === "connecting" && (
          <div className="voice-state relative z-[1]">
            <p className="font-display text-base text-gold-soft mb-1">Opening the circle…</p>
            <p className="text-sm text-fg-muted leading-relaxed">
              Requesting microphone for the in-app voice shell.
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="voice-state voice-state-error relative z-[1]">
            <p className="font-display text-base text-danger mb-1">Mic unavailable</p>
            <p className="text-sm text-fg-muted leading-relaxed">
              {error}. Allow mic access to join the staging voice shell (WebRTC demo).
            </p>
          </div>
        )}
        {status === "live" && (
          <div className="relative z-[1] space-y-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-gold">Your mic level</p>
            <div className="voice-meter">
              <div
                className="voice-meter-fill"
                style={{ width: `${muted || deafened ? 0 : level}%` }}
              />
            </div>
            <audio ref={audioRef} autoPlay playsInline />
          </div>
        )}

        <div className="relative z-[1]">
          <p className="text-[10px] uppercase tracking-[0.14em] text-gold mb-2">In call</p>
          <ul className="voice-roster space-y-1.5">
            {roster.length === 0 ? (
              <li className="voice-state text-sm text-fg-muted py-3 px-3">
                Quiet circle — waiting for presence…
              </li>
            ) : (
              roster.map((p) => {
                const initial = p.vesselName.trim().charAt(0).toUpperCase() || "·";
                const live = !p.muted && !p.deafened;
                return (
                  <li key={p.vesselId} className="voice-roster-row">
                    <span className="voice-avatar" aria-hidden>
                      {initial}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-fg truncate">
                        {p.vesselName}
                      </span>
                    </span>
                    <span
                      className="voice-pip"
                      data-live={live ? "true" : "false"}
                    >
                      {p.muted ? "Muted" : ""}
                      {p.muted && p.deafened ? " · " : ""}
                      {p.deafened ? "Deafened" : ""}
                      {live ? "Live" : ""}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="relative z-[1] grid grid-cols-3 gap-2">
          <button
            type="button"
            className={`btn-ghost text-sm ${muted ? "border-gold text-gold" : ""}`}
            onClick={toggleMute}
            disabled={status !== "live"}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            className={`btn-ghost text-sm ${deafened ? "border-gold text-gold" : ""}`}
            onClick={toggleDeafen}
            disabled={status !== "live"}
          >
            {deafened ? "Undeafen" : "Deafen"}
          </button>
          <button type="button" className="btn-gold text-sm" onClick={leave}>
            Leave
          </button>
        </div>
        <p className="relative z-[1] text-[11px] text-fg-muted leading-relaxed">
          Staging voice: local mic + WebRTC loopback + shared presence. Multi-browser
          mesh signaling ships next — still in-app.
        </p>
      </div>
    </div>
  );
}
