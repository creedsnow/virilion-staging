"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { DiceSettledDetail, DiceStageElement } from "@/types/dice-stage";

export type DiceStageHandle = {
  roll: (opts: {
    sides?: number;
    result?: string | number;
    theme?: string;
  }) => Promise<string>;
  setTheme: (theme: string) => void;
};

type Props = {
  theme: string;
  muted?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onSettled?: (detail: DiceSettledDetail) => void;
};

let scriptPromise: Promise<void> | null = null;

function ensureDiceStageScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (customElements.get("dice-stage")) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-dice-kit="dice-stage"]'
    );
    if (existing) {
      if (customElements.get("dice-stage")) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("dice-stage.js failed to load")),
        { once: true }
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "/dice-kit/dice-stage.js";
    script.async = true;
    script.dataset.diceKit = "dice-stage";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("dice-stage.js failed to load"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export const DiceStage = forwardRef<DiceStageHandle, Props>(function DiceStage(
  { theme, muted = false, className, style, onSettled },
  ref
) {
  const hostRef = useRef<DiceStageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;

  useEffect(() => {
    let cancelled = false;
    ensureDiceStageScript()
      .then(() => {
        if (!cancelled) setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !loaded) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<DiceSettledDetail>).detail;
      onSettledRef.current?.(detail);
    };
    el.addEventListener("die-settled", handler);
    return () => el.removeEventListener("die-settled", handler);
  }, [loaded]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !loaded) return;
    if (el.getAttribute("theme") !== theme) {
      el.setAttribute("theme", theme);
    }
  }, [theme, loaded]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !loaded) return;
    if (muted) el.setAttribute("muted", "");
    else el.removeAttribute("muted");
  }, [muted, loaded]);

  useImperativeHandle(
    ref,
    () => ({
      roll: (opts) => {
        const el = hostRef.current;
        if (!el?.roll) return Promise.reject(new Error("dice stage not ready"));
        return el.roll(opts);
      },
      setTheme: (name) => {
        hostRef.current?.setAttribute("theme", name);
      },
    }),
    []
  );

  const setHostRef = useCallback((node: DiceStageElement | null) => {
    hostRef.current = node;
  }, []);

  if (!loaded) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "360px",
          maxWidth: "480px",
          ...style,
        }}
        aria-busy="true"
        aria-label="Loading casting bowl"
      />
    );
  }

  return (
    <dice-stage
      ref={setHostRef}
      theme={theme}
      muted={muted || undefined}
      className={className}
      style={{
        width: "100%",
        height: "360px",
        maxWidth: "480px",
        ...style,
      }}
    />
  );
});
