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

        // Loopback WebRTC so the demo exercises a real peer connection path
        const pc1 = new RTCPeerConnection();
        const pc2 = new RTCPeerConnection();
        pcRef.current = pc1;
        stream.getTracks().forEach((t) => pc1.addTrack(t, stream));
        pc2.ontrack = (ev) => {
          if (audioRef.current) {
            audioRef.current.srcObject = ev.streams[0];
            audioRef.current.muted = true; // avoid feedback; level meter uses analyser
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="card w-full max-w-md space-y-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">In-app voice</p>
            <h2 className="text-lg font-semibold text-fg">{sceneTitle}</h2>
          </div>
          <button type="button" className="btn-ghost text-xs py-1 px-2" onClick={leave}>
            Close
          </button>
        </div>

        {status === "connecting" && (
          <p className="text-sm text-fg-muted animate-pulse">
            Connecting demo voice… requesting microphone…
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-danger">
            {error}. Allow mic access to join the voice shell. This is in-app WebRTC demo —
            not Discord.
          </p>
        )}
        {status === "live" && (
          <>
            <div className="space-y-1">
              <p className="text-xs text-fg-muted">Your mic level</p>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-gold transition-[width] duration-75"
                  style={{ width: `${muted || deafened ? 0 : level}%` }}
                />
              </div>
            </div>
            <audio ref={audioRef} autoPlay playsInline />
          </>
        )}

        <div>
          <p className="label">In call</p>
          <ul className="space-y-1">
            {roster.length === 0 ? (
              <li className="text-sm text-fg-muted">Waiting for presence…</li>
            ) : (
              roster.map((p) => (
                <li
                  key={p.vesselId}
                  className="flex justify-between text-sm border-b border-border/60 py-1"
                >
                  <span className="text-fg">{p.vesselName}</span>
                  <span className="text-fg-muted text-xs">
                    {p.muted ? "Muted" : ""}
                    {p.muted && p.deafened ? " · " : ""}
                    {p.deafened ? "Deafened" : ""}
                    {!p.muted && !p.deafened ? "Live" : ""}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-2">
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
        <p className="text-[11px] text-fg-muted leading-relaxed">
          Staging voice: local mic + WebRTC loopback + shared presence. Multi-browser mesh
          signaling ships next; never Discord.
        </p>
      </div>
    </div>
  );
}
