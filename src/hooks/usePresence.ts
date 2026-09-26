"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getPresence,
  setPresenceAndNotify,
  subscribePresence,
  type PresenceMode,
} from "@/lib/storage";

function getServerSnapshot(): PresenceMode {
  return "open";
}

export function usePresence(): [PresenceMode, (next: PresenceMode) => void] {
  const presence = useSyncExternalStore(
    subscribePresence,
    getPresence,
    getServerSnapshot
  );
  const set = useCallback((next: PresenceMode) => {
    setPresenceAndNotify(next);
  }, []);
  return [presence, set];
}
