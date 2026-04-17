"use client";

import { useSyncExternalStore } from "react";

const subscribers = new Map<number, Set<() => void>>();
const intervalIds = new Map<number, ReturnType<typeof setInterval>>();

function subscribe(intervalMs: number, callback: () => void) {
  if (!subscribers.has(intervalMs)) subscribers.set(intervalMs, new Set());
  const set = subscribers.get(intervalMs)!;
  set.add(callback);
  if (!intervalIds.has(intervalMs)) {
    intervalIds.set(
      intervalMs,
      setInterval(() => set.forEach((cb) => cb()), intervalMs),
    );
  }
  return () => {
    set.delete(callback);
    if (set.size === 0) {
      const id = intervalIds.get(intervalMs);
      if (id) clearInterval(id);
      intervalIds.delete(intervalMs);
    }
  };
}

const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => 0;

/**
 * Returns the current epoch in seconds, refreshed every `intervalMs`.
 * Server snapshot is 0 to keep SSR markup deterministic; the real value
 * is filled in once on hydration.
 */
export function useNowSeconds(intervalMs = 30_000) {
  return useSyncExternalStore(
    (cb) => subscribe(intervalMs, cb),
    getSnapshot,
    getServerSnapshot,
  );
}
